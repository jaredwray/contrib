import { Photo } from './photo'
import { Video } from './video'

// A Charity is an organization that will receive proceeds an Auction.
export type Charity = {
    _id: string,            // Short name for key & slug
    name: string,
    ein: string,            // Tax ID
    description: string,
    homepage: string,
    location: Location,
    photos: Photo[],
    videos: Video[]
}

// A CharityRef is a reference to a charity from an auction or an athlete.
export type CharityRef = {
    id: string,
    name: string
}