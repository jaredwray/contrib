import { ObjectId } from 'mongodb'
import { AthleteRef } from './athlete'
import { CharityRef } from './charity'
import { Photo } from './photo'
import { Video } from './video'

export type AuctionId = ObjectId
export type Price = number

// An Auction is a single item being sold by an Athlete to benefit a
// Charity. It is valid for a specific duration between startAt and
// endAt. It may contain a number of Videos or Photos to help show the
// item \as well as a detailed description.
export type Auction = {
    _id: AuctionId,
    title: string,
    description: string,
    startAt: Date,
    endAt: Date,
    startPrice: Price,
    seller: SellerRef,      // Index on seller.id
    location: Location,
    active: boolean,        // Index
    videos: Video[],
    photos: Photo[],
    charities: CharityRef[],
    sport: 'Soccer' | 'Football' | 'Basketball' | 'Baseball',
    features: ItemFeatures
}

export enum AuctionStatus {
    NotStarted,
    Active,
    Ended
}

export function getAuctionStatus(auction: Auction): AuctionStatus {
    const now = new Date()
    if (new Date(auction.startAt) > now) return AuctionStatus.NotStarted
    if (new Date(auction.endAt) <= now) return AuctionStatus.Ended
    return AuctionStatus.Active
}

export type AuctionRef = {
    id: AuctionId,
    title: string
}

export type ItemFeatures = {
    gameWorn: boolean,
    signed: boolean,
    certificate: boolean
}

export type SellerRef = AthleteRef