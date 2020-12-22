import { Auction, AuctionId, Price } from 'src/models/database/auction'
import { MaxBid } from 'src/models/database/maxbid'
import { HighBid } from 'src/models/database/highbid'
import { ContribDocuments } from 'src/models/database/docs'
import { ObjectID, ObjectId } from 'mongodb'
import { UserId } from 'src/models/database/user'

// Reasons why a MaxBid might be rejected.
export enum MaxBidError {
    AuctionNotStarted = "AuctionNotStarted",
    AuctionEnded = "AuctionEnded",
    AmountBelowStarting = "AmountBelowStarting",
    AmountBelowHighest = "AmountBelowHigest",
    AmountBelowMax = "AmountBelowYourMax"
}

// Descriptions returned to users as to why their bid failed
export function getMaxBidErrorMessage(error: MaxBidError): string {
    switch (error) {
        case MaxBidError.AuctionNotStarted: return "Auction not yet started"
        case MaxBidError.AuctionEnded: return "Auction has already ended"
        case MaxBidError.AmountBelowStarting: return "Max bid is below the auction starting price"
        case MaxBidError.AmountBelowHighest: return "Max bid is below current winning bid + increment"
        case MaxBidError.AmountBelowMax: return "Max bid is below your existing max bid + increment"
        default: return "Unknown bid error"
    }
}

// Auto bidding allows you to specify a MaxBid rather than multiple bids because of the
// asyncronous nature of online bidding.
// We have two concepts - a MaxBid placed by an individual for an item that contains a maximum bid price
// and a HighBid which is an indication as to who is winning at any point in time and at what price.
// Think of MaxBid as the private conversation you have with a proxy at a physical auction about how high
// they can go on your behalf and the HighBid as a bid made by the proxy in the room that other bidders know.
export class AutoBidder {
    constructor(private docs: ContribDocuments) {
    }

    // Get the minimum bid price for an auction. If a user is specified it will base it on their max
    // bid. If not it will base it on the current highest bid. Failing that it's the start price.
    public async GetMinBidPrice(auction: Auction, userId: ObjectID | null = null): Promise<Price> {
        const highest = await this.GetHighestBid(auction._id)
        const maxBid = userId !== null ? await this.GetMaxBidForUser(auction._id, userId) : null
        
        if (maxBid != null && highest != null)
            return AutoBidder.AddMinIncrement(highest.price > maxBid.maxPrice ? highest.price : maxBid.maxPrice)

        if (maxBid !== null)
            return AutoBidder.AddMinIncrement(maxBid.maxPrice)

        if (highest !== null)
            return AutoBidder.AddMinIncrement(highest.price)

        return auction.startPrice
    }

    // Place a maximum bid for an item. This will record the users maximum bid as a MaxBid after ensuring the
    // auction is open and the bid is now below the current acceptable known public (HighBid) limits.
    // Once the MaxBid is accepted and recorded it will create a new HighBid that might either be for this
    // bidder or for another bidder who already has a higher max bid price than the one given here.
    // Getting an error indicates we did not record the MaxBid at all as it was unacceptable. Even if we do
    // however record the maximum bid there is no guarantee the user is now winning.
    public async PlaceMaxBid(auction: Auction, maxPrice: Price, buyerUserId: UserId): Promise<MaxBid | MaxBidError> {
        const now = new Date()
        const error = await this.ValidateMaxBid(auction, maxPrice, now, buyerUserId)
        if (error) return error

        // Now place the maximum bid
        const maxBid: MaxBid = {
            _id: new ObjectId(),
            auctionId: auction._id,
            buyerUserId,
            maxPrice,
            receivedAt: now
        }

        await this.docs.maxBids().insertOne(maxBid)

        // See how the max bid plays out with other bidders
        await this.ResolveMaxBids(auction)

        return maxBid
    }

    // Right now we call this interactively to avoid having to run background services
    // however it would probably be better to call this on a background task in the future.
    public async ResolveMaxBids(auction: Auction): Promise<void> {
        const highestBid = await this.CreateHighestBid(auction)
        if (highestBid !== null)
            await this.docs.highBids().insertOne(highestBid)
    }

    public async CreateHighestBid(auction: Auction): Promise<HighBid> {
        // Start by figuring how what the minimum bid allowed is.
        const currentHighestBid = await this.GetHighestBid(auction._id)
        const minBidAllowed = currentHighestBid !== null
            ? AutoBidder.AddMinIncrement(currentHighestBid.price)
            : auction.startPrice

        // Retrieve the top two maximum bids that are over the minimum bid allowed with
        // earliest max bid as a tie-breaker when they are the same max price.
        const maxBids = await this.docs
            .maxBids()
            .find({ auctionId: auction._id, maxPrice: { $gte: minBidAllowed } })
            .sort({ maxPrice: -1, receivedAt: 1 })
            .toArray()

        // If this is running on a background task or because of currency we may
        // not have any max bids to process.
        if (maxBids.length === 0)
            return null

        // If we only have one viable max bid then just meet the min bid allowed.
        if (maxBids.length === 1 && maxBids[0].buyerUserId.toHexString() !== currentHighestBid.buyerUserId.toHexString())
            return this.CreateHighBid(maxBids[0], minBidAllowed)

        // If we have two or more max bids then the largest high bid should be the increment above
        // the next larges max providing not same user. If that is still below their max bid all is good.
        if (maxBids.length === 2) {
            const highBidPrice = AutoBidder.AddMinIncrement(maxBids[1].maxPrice)
            if (highBidPrice <= maxBids[0].maxPrice && maxBids[0].buyerUserId.toHexString() !== maxBids[1].buyerUserId.toHexString())
                return this.CreateHighBid(maxBids[0], highBidPrice)
        }

        // The highest bid can't beat the next highest by the increment necessary so who wins?
        // Well the earliest max bid that can't be beat by the relevant increment.
        maxBids.sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime())

        let winMaxBid = maxBids.shift()
        let bidPrice = AutoBidder.AddMinIncrement(winMaxBid.maxPrice)
        for (const maxBid of maxBids) {
            if (maxBid.maxPrice >= bidPrice) {
                winMaxBid = maxBid
                bidPrice = AutoBidder.AddMinIncrement(winMaxBid.maxPrice)
            }
        }

        // A user increasing their max bid should not count as a bid against themselves
        if (winMaxBid.buyerUserId.toHexString() === currentHighestBid.buyerUserId.toHexString())
            return null

        return this.CreateHighBid(winMaxBid, winMaxBid.maxPrice)
    }

    // Ensure a max bid is valid before we record and process it.
    public async ValidateMaxBid(auction: Auction, maxPrice: Price, now: Date, buyerUserId: UserId): Promise<MaxBidError | null> {
        // Basic validation against the auction itself
        if (auction.startPrice > maxPrice) return MaxBidError.AmountBelowStarting
        if (auction.startAt > now) return MaxBidError.AuctionNotStarted
        if (auction.endAt <= now) return MaxBidError.AuctionEnded

        // Do not allow a user to place a bid that's below current known high (public) bid
        const highest = await this.GetHighestBid(auction._id)
        if (highest !== null && maxPrice < highest.price) return MaxBidError.AmountBelowHighest

        // Make sure we don't allow a user to place a lower max bid than they already have
        const existingUserMaxBid = await this.GetMaxBidForUser(auction._id, buyerUserId)
        if (existingUserMaxBid !== null && maxPrice <= existingUserMaxBid.maxPrice) return MaxBidError.AmountBelowMax
    }

    // Figure out the minimum bid price based on the current price and the min increment table.
    public static AddMinIncrement(highestBidPrice: Price): Price {
        return highestBidPrice + GetMinIncrement(highestBidPrice)
    }

    // Get the largest (private) max bid for an auction and specific user.
    public async GetMaxBidForUser(auctionId: ObjectID, userId: ObjectID): Promise<MaxBid> {
        const maxBids = await this.docs
            .maxBids()
            .find({ auctionId: auctionId, buyerUserId: userId })
            .sort({ maxPrice: -1 })
            .limit(1)
            .toArray()
        return maxBids.length > 0 ? maxBids[0] : null
    }

    // Get the highest (public) bid for an auction.
    public async GetHighestBid(auctionId: AuctionId): Promise<HighBid> {
        const highestBid = await this.docs
            .highBids()
            .find({ auctionId })
            .sort({ placedAt: -1 })
            .limit(1)
            .toArray()
        return highestBid.length === 0 ? null : highestBid[0]
    }

    private CreateHighBid(maxBid: MaxBid, price: Price): HighBid {
        return {
            _id: new ObjectId(),
            auctionId: maxBid.auctionId,
            buyerUserId: maxBid.buyerUserId,
            placedAt: new Date(),
            originatingMaxBidId: maxBid._id,
            price: price
        }
    }
}

// Price increment table (USD). All values are in cents to avoid rounding issues in JavaScript.
function GetMinIncrement(price: Price): Price {
    // Taken from eBay https://www.ebay.com/help/buying/bidding/automatic-bidding?id=4014#section3
    if (price < 100) return 5
    if (price < 500) return 25
    if (price < 2500) return 50
    if (price < 10000) return 100
    if (price < 25000) return 250
    if (price < 50000) return 500
    if (price < 100000) return 1000
    if (price < 250000) return 2500
    if (price < 500000) return 5000
    return 100
}