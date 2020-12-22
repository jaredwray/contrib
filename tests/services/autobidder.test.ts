import { AutoBidder, MaxBidError } from 'src/services/autobidder'
import { Auction } from 'src/models/database/auction'
import { HighBid } from 'src/models/database/highbid'
import { MaxBid } from 'src/models/database/maxbid'
import { ObjectId } from 'mongodb'

describe('AutoBidder', () => {
    const daysAhead = (days) => {
        const newDate = new Date()
        newDate.setDate(newDate.getDate() + days)
        return newDate
    }

    const validUserId = new ObjectId()
    const validAuction = { startPrice: 1099, startAt: daysAhead(-1), endAt: daysAhead(1) } as Auction

    it('GetMinBidPrice returns startPrice when no high bids (anonymous)', () => {
        const autobidder = new AutoBidder(null)
        autobidder.GetHighestBid = () => Promise.resolve(null)
        const auction = { startPrice: 1099 } as Auction
        return expect(autobidder.GetMinBidPrice(auction)).resolves.toBe(auction.startPrice)
    })

    it('GetMinBidPrice returns startPrice when no high bids', () => {
        const autobidder = new AutoBidder(null)
        autobidder.GetHighestBid = () => Promise.resolve(null)
        autobidder.GetMaxBidForUser = () => Promise.resolve(null)
        const auction = { startPrice: 1099 } as Auction
        return expect(autobidder.GetMinBidPrice(auction, validUserId)).resolves.toBe(auction.startPrice)
    })

    it('GetMinBidPrice returns highest bid plus increment (anonymous)', () => {
        const autobidder = new AutoBidder(null)
        const highBid = { price: 1234 } as HighBid
        autobidder.GetHighestBid = () => Promise.resolve(highBid)
        const auction = {} as Auction
        return expect(autobidder.GetMinBidPrice(auction)).resolves.toBe(AutoBidder.AddMinIncrement(highBid.price))
    })

    it('GetMinBidPrice returns highest bid plus increment when user has no bids', () => {
        const autobidder = new AutoBidder(null)
        const highBid = { price: 1234 } as HighBid
        autobidder.GetHighestBid = () => Promise.resolve(highBid)
        autobidder.GetMaxBidForUser = () => Promise.resolve(null)
        return expect(autobidder.GetMinBidPrice(validAuction, validUserId)).resolves.toBe(AutoBidder.AddMinIncrement(highBid.price))
    })

    it('GetMinBidPrice returns users max bid plus increment when there is a max bid', () => {
        const autobidder = new AutoBidder(null)
        const maxBid = { maxPrice: 12345, buyerUserId: new ObjectId() } as MaxBid
        autobidder.GetHighestBid = () => Promise.resolve({ price: 12300 } as HighBid)
        autobidder.GetMaxBidForUser = () => Promise.resolve(maxBid)
        return expect(autobidder.GetMinBidPrice(validAuction, maxBid.buyerUserId)).resolves.toBe(AutoBidder.AddMinIncrement(maxBid.maxPrice))
    })

    it('GetMinBidPrice returns users max bid plus increment when there is a max bid but no high bid (recovery)', () => {
        const autobidder = new AutoBidder(null)
        const maxBid = { maxPrice: 12345, buyerUserId: new ObjectId() } as MaxBid
        autobidder.GetHighestBid = () => Promise.resolve(null)
        autobidder.GetMaxBidForUser = () => Promise.resolve(maxBid)
        return expect(autobidder.GetMinBidPrice(validAuction, maxBid.buyerUserId)).resolves.toBe(AutoBidder.AddMinIncrement(maxBid.maxPrice))
    })

    it('GetMinBidPrice returns maxBid increment when it is higher than high bid', () => {
        const autobidder = new AutoBidder(null)
        const highBid = { price: 12300 } as HighBid
        const maxBid = { maxPrice: 12345, buyerUserId: new ObjectId() } as MaxBid
        autobidder.GetHighestBid = () => Promise.resolve(highBid)
        autobidder.GetMaxBidForUser = () => Promise.resolve(maxBid)
        return expect(autobidder.GetMinBidPrice(validAuction, maxBid.buyerUserId)).resolves.toBe(AutoBidder.AddMinIncrement(maxBid.maxPrice))
    })

    it('GetMinBidPrice returns high bid increment when it is higher than users max bid', () => {
        const autobidder = new AutoBidder(null)
        const highBid = { price: 12000 } as HighBid
        const maxBid = { maxPrice: 10000, buyerUserId: new ObjectId() } as MaxBid
        autobidder.GetHighestBid = () => Promise.resolve(highBid)
        autobidder.GetMaxBidForUser = () => Promise.resolve(maxBid)
        return expect(autobidder.GetMinBidPrice(validAuction, maxBid.buyerUserId)).resolves.toBe(AutoBidder.AddMinIncrement(highBid.price))
    })

    it('ValidateMaxBid returns error if does not meet starting price', () => {
        const autobidder = new AutoBidder(null)
        const result = autobidder.ValidateMaxBid(validAuction, 1098, new Date(), new ObjectId())
        return expect(result).resolves.toBe(MaxBidError.AmountBelowStarting)
    })

    it('ValidateMaxBid returns error if auction not started', () => {
        const autobidder = new AutoBidder(null)
        const auction = { startPrice: 1099, startAt: daysAhead(1), endAt: daysAhead(2) } as Auction
        const result = autobidder.ValidateMaxBid(auction, auction.startPrice, new Date(), new ObjectId())
        return expect(result).resolves.toBe(MaxBidError.AuctionNotStarted)
    })

    it('ValidateMaxBid returns error if auction has ended', () => {
        const autobidder = new AutoBidder(null)
        const auction = { startPrice: 1099, startAt: daysAhead(-2), endAt: daysAhead(-1) } as Auction
        const result = autobidder.ValidateMaxBid(auction, auction.startPrice, new Date(), new ObjectId())
        return expect(result).resolves.toBe(MaxBidError.AuctionEnded)
    })

    it('ValidateMaxBid returns error if amount is below current high bid + min increment', () => {
        const autobidder = new AutoBidder(null)
        autobidder.GetHighestBid = () => Promise.resolve({ price: 12345 } as HighBid)
        const result = autobidder.ValidateMaxBid(validAuction, 12344, new Date(), new ObjectId())
        return expect(result).resolves.toBe(MaxBidError.AmountBelowHighest)
    })

    it('ValidateMaxBid returns error if amount is below users max bid + min increment', () => {
        const autobidder = new AutoBidder(null)
        autobidder.GetHighestBid = () => Promise.resolve({ price: 10000 } as HighBid)
        autobidder.GetMaxBidForUser = () => Promise.resolve({ maxPrice: 15000 } as MaxBid)
        const result = autobidder.ValidateMaxBid(validAuction, 15000, new Date(), new ObjectId())
        return expect(result).resolves.toBe(MaxBidError.AmountBelowMax)
    })

    it('ValidateMaxBid returns error if amount is below users max bid + min increment', () => {
        const autobidder = new AutoBidder(null)
        autobidder.GetHighestBid = () => Promise.resolve({ price: 10000 } as HighBid)
        autobidder.GetMaxBidForUser = () => Promise.resolve({ maxPrice: 15000 } as MaxBid)
        const result = autobidder.ValidateMaxBid(validAuction, 15000, new Date(), new ObjectId())
        return expect(result).resolves.toBe(MaxBidError.AmountBelowMax)
    })
})
