import { Avatar } from './avatar'
import { Photo } from './photo'
import { SocialMedia } from './socialMedia'
import { Video } from './video'

// A Charity is an organization that will receive proceeds an Auction.
export type Charity = {
    _id: string,            // Short name for key & slug
    name: string,
    ein: string,            // Tax ID
    description: string,
    shortDescription: string,
    homepage: string,
    location: Location,
    joined: Date,
    photos: Photo[],
    videos: Video[],
    avatar: Avatar,
    verified: boolean,
    social: SocialMedia,
    officialSite: string
}

// A CharityRef is a reference to a charity from an auction or an athlete.
export type CharityRef = {
    id: string,
    name: string
}