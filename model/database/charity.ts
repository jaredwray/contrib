import { ObjectID } from 'mongodb'
import { Photo } from './photo'
import { Video } from './video'

// A Charity is an organization that will receive proceeds from one or more Auctions.
export type Charity = {
    _id: ObjectID,
    name: string,
    ein: string,            // Tax ID
    description: string,
    homepage: string,
    location: Location,
    photos: Photo[],
    videos: Video[]
}