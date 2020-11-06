import { ObjectID } from 'mongodb'
import { CharitySupport } from './charitySupport'
import { Photo } from './photo'
import { Video } from './video'

// An Auction is a single item being sold by an Athlete to benefit one or
// more Charities. It is valid for a specific duration between startAt and
// endAt. It may contain a number of Videos or Photos to help show the item
// as well as a detailed description.
export type Auction = {
    _id: ObjectID,
    title: string,
    description: string,
    startAt: Date,
    endAt: Date,
    startPrice: number,
    seller: AuctionSellerRef,
    location: Location,
    active: boolean,
    videos: Video[],
    photos: Photo[],
    charities: CharitySupport[]
}

export type AuctionSellerRef = {
    id: ObjectID,
    name: string,
    type: 'athelete'
}
