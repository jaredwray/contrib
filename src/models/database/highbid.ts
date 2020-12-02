import { ObjectId } from 'mongodb'
import { AuctionId, Price } from './auction'
import { MaxBidId } from './maxbid'
import { UserId } from './user'

export type HighBidId = ObjectId

// A HighBid is the highest bid on an auction for a given
// point in time, as calculated and record by way of an
// originating MaxBid.
export type HighBid = {
    _id: HighBidId,
    placedAt: Date,          // Must never be after Auction end
    auctionId: AuctionId,    // Index
    buyerUserId: UserId,     // Index
    originatingMaxBidId: MaxBidId,
    price: Price          
}
