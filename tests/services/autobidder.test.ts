import { AutoBidder } from 'src/services/autobidder'
import { Auction } from 'src/models/database/auction'

describe('AutoBidder', () => {
    it('GetMinBidPriceForAuctionUser gets min bid price when no user', () => {
        const autobidder = new AutoBidder(null)
        autobidder.GetHighestBid = () => Promise.resolve(null)
        const auction = { startPrice: 1099 } as Auction
        expect(autobidder.GetMinBidPriceForAuctionUser(auction, null)).resolves.toBe(auction.startPrice)
    })

    it('GetMinPublicBidPriceForAuction returns startPrice when no high bids', () => 
    {
        const autobidder = new AutoBidder(null)
        autobidder.GetHighestBid = () => Promise.resolve(null)
        const auction = { startPrice: 1099 } as Auction
        expect(autobidder.GetMinPublicBidPriceForAuction(auction)).resolves.toBe(auction.startPrice)
    })
})
