import { ObjectId } from 'mongodb'
import { AuctionId, Price } from './auction'
import { UserId } from './user'

export type BidId = ObjectId

export type Bid = {
    _id: string,
    receivedAt: Date,
    auctionId: AuctionId,    // Index
    buyerUserId: UserId,     // Index
    amount: Price          
}
