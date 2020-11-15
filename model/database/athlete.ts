import { CharityRef } from './charity'
import { Photo } from './photo'
import { SocialMedia } from './socialMedia'

export type AthleteId = string

// An Athlete is a member of the sporting community who
// has joined Contrib in order to sell items for Charity.
export type Athlete = {
    _id: AthleteId, // Short name for key & slug
    name: string,
    firstName: string,
    lastName: string,
    description: string,
    charities: CharityRef[],
    avatar: AthleteAvatar,    
    social: SocialMedia,
    location: Location,
    joined: Date,
    verified: true,
    photos: Photo[]
}

// TODO: Replace with tags on photos collection for flexibility.
export type AthleteAvatar = {
    medium: string,
    large: string
}

// An AthleteRef is a reference to an athlete from an auction.
export type AthleteRef = {
    id: AthleteId,
    name: string
}
