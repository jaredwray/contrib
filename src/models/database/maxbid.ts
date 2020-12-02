import { ObjectId } from 'mongodb'
import { AuctionId, Price } from './auction'
import { UserId } from './user'

export type MaxBidId = ObjectId

// As MaxBid is a bid a user places that has a maximum price for the 
// sake of asyncronous automatic bidding.
export type MaxBid = {
    _id: MaxBidId,
    receivedAt: Date,
    auctionId: AuctionId,    // Index
    buyerUserId: UserId,     // Index
    maxPrice: Price          
}
