import { Auction, AuctionId, Price } from 'models/database/auction'
import { MaxBid } from 'models/database/maxbid'
import { HighBid } from 'models/database/highbid'
import { ContribDocuments } from 'models/database/docs'
import { ObjectId } from 'mongodb'
import { UserId } from 'models/database/user'

// Reasons why a MaxBid might be rejected.
export enum MaxBidError {
    AuctionNotStarted = "AuctionNotStarted",      // The auction hasn't yet started
    AuctionEnded = "AuctionEnded",                // The auction is over
    AmountBelowStarting = "AmountBelowStarting",  // The bid amount is below the starting bid price
    AmountBelowHighest = "AmountBelowHigest",     // The bid amount is below the current highest bid price
    AmountBelowMax = "AmountBelowYourMax"         // The bid amount is below your current max bid price
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

    // Get the minimum bid price - this is the current HighBid plus a minimum increment amount.
    // We do not return the underlying MaxBid because that is private to the bidder.
    public async GetMinBidPriceForAuction(auctionId: AuctionId): Promise<Price> {
        const highest = await this.GetHighestBid(auctionId)
        if (highest !== null)
            return this.GetMinBidPrice(highest.price)

        const auction = await this.GetAuction(auctionId)
        return auction.startPrice
    }

    // Place a maximum bid for an item. This will record the users maximum bid as a MaxBid after ensuring the
    // auction is open and the bid is now below the current acceptable known public (HighBid) limits.
    // Once the MaxBid is accepted and recorded it will create a new HighBid that might either be for this
    // bidder or for another bidder who already has a higher max bid price than the one given here.
    // Getting an error indicates we did not record the MaxBid at all as it was unacceptable. Even if we do
    // however record the maximum bid there is no guarantee the user is now winning.
    public async PlaceMaxBid(auctionId: AuctionId, maxPrice: Price, buyerUserId: UserId): Promise<MaxBid | MaxBidError> {
        const now = new Date()
        const error = await this.ValidateMaxBid(auctionId, maxPrice, now, buyerUserId)
        if (error) return error

        // Now place the maximum bid
        const maxBid: MaxBid = {
            _id: new ObjectId,
            auctionId,
            buyerUserId,
            maxPrice,
            receivedAt: now
        }
        await this.docs.maxBids().insertOne(maxBid)

        // See how the max bid plays out with other bidders
        await this.ResolveMaxBids(auctionId)

        return maxBid
    }

    // Right now we call this interactively to avoid having to run background services
    // however it would probably be better to call this on a background task in the future.
    public async ResolveMaxBids(auctionId: AuctionId): Promise<void> {
        const highestBid = await this.CreateHighestBid(auctionId)
        if (highestBid !== null)
            await this.docs.highBids().insertOne(highestBid)
    }

    public async CreateHighestBid(auctionId: AuctionId): Promise<HighBid> {
        // Get the highest two bids ordered by maxPrice (earliest first when the same)
        const maxBids = await this.docs
            .maxBids()
            .find({ auctionId })
            .sort({ maxPrice: 2, receivedAt: 1 })
            .limit(2)
            .toArray()

        // Should never be no bids but could happen if called on a background task
        if (maxBids.length === 0)
            return null

        const auction = await this.GetAuction(auctionId)
        const highestBid = await this.GetHighestBid(auctionId)

        // If we only have one max bid then the high bid should be at the starting price
        if (maxBids.length === 1) 
            return this.CreateHighBid(maxBids[0], auction.startPrice)        

        // We have more than one bid so really there should already be a high bid
        if (highestBid == null)
            console.warn(`Auction ${auctionId} has multiple bids but none highest.`)

        const minBidAllowed = highestBid !== null
            ? this.GetMinBidPrice(highestBid.price)
            : auction.startPrice
    
        // Should never happen but with concurrency we want to be sure
        if (maxBids[0].maxPrice < minBidAllowed)
            return null

        // The second maxBid we have should be who currently has the highest bid but... concurrency
        if (highestBid.buyerUserId !== maxBids[1].buyerUserId)
            console.warn(`Auction ${auctionId} has two bids but lower one does not match high bid user`)

        // Figure out the new high bid price
        const highPrice = maxBids[1].maxPrice <= minBidAllowed
            ? minBidAllowed 
            : maxBids[1].maxPrice // Auto-bidding!
       
        if (maxBids[0].buyerUserId === highestBid.buyerUserId)
            console.warn(`Auction ${auctionId} is finding user ${highestBid.buyerUserId} competing at ${highPrice} and ${highestBid.price}`)

        return this.CreateHighBid(maxBids[0], highPrice)
    }

    // Ensure a max bid is valid before we record and process it.
    private async ValidateMaxBid(auctionId: AuctionId, maxPrice: Price, now: Date, buyerUserId: UserId): Promise<MaxBidError | null> {
        const auction = await this.GetAuction(auctionId)
        if (auction.startPrice > maxPrice) return MaxBidError.AmountBelowHighest
        if (auction.startAt < now) return MaxBidError.AuctionNotStarted
        if (auction.endAt >= now) return MaxBidError.AuctionEnded

        const highest = await this.GetHighestBid(auctionId)
        if (highest !== null && maxPrice < highest.price) return MaxBidError.AmountBelowHighest
        
        // Make sure we don't let a user put in a lower max bid than they already have
        const existingUserMaxBid = await this.docs
            .maxBids()
            .find({ auctionId, buyerUserId })
            .sort({ maxPrice: 2})
            .limit(1)
            .toArray()
        if (existingUserMaxBid.length === 1 && maxPrice <= existingUserMaxBid[0].maxPrice) return MaxBidError.AmountBelowMax
    }

    // Figure out the minimum bid price based on the current price and the min increment table.
    private GetMinBidPrice(highestBidPrice: Price): Price {
        return highestBidPrice + this.GetMinIncrement(highestBidPrice)
    }

    // Get the highest bid... not sure this is concurrent-friendly yet.
    private async GetHighestBid(auctionId: AuctionId): Promise<HighBid> {
        const highestBid = await this.docs
            .highBids()
            .find({ auctionId })
            .sort({ placedAt: 1 })
            .limit(1)
            .toArray()

        return highestBid.length === 0 ? null : highestBid[0]
    }

    // The very first high bid on an item will always be at starting price.
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

    // Get an Auction by id. Ideally this would be a method on Collection<T> in MongoDb.
    private GetAuction(auctionId: AuctionId): Promise<Auction> {
        return this.docs.auctions().findOne({ _id: auctionId })
    }

    // Price increment table (USD). All values are in cents to avoid rounding issues in JavaScript.
    private GetMinIncrement(price: Price): Price {
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
}