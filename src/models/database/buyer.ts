import { ObjectID } from 'mongodb'
import { ObjectId } from 'mongodb'
import { TaggedAddress } from './address'
import { UserId } from './user'

// A Buyer is somebody who can place bids on the site.
export type Buyer = {
    _id: UserId,                // Must match UserId
    addresses: TaggedAddress[]
}
