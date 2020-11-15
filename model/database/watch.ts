import { ObjectId } from 'mongodb'
import { AuctionId } from './auction'
import { UserId } from './user'

export type WatchId = ObjectId

export type Watch = {
    _id: WatchId,
    auctionId: AuctionId,   // Index
    buyerId: UserId         // Index
}