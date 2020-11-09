import { ObjectID } from 'mongodb'
import { CharitySupport } from './charitySupport'
import { SocialMedia } from './socialMedia'

// An Athlete is a member of the sporting community who
// has joined Contrib in order to sell items for Charity.
export type Athlete = {
    _id: ObjectID,
    name: string,
    firstName: string,
    lastName: string,
    description: string,
    charities: CharitySupport[],
    avatar: AthleteAvatar,    
    social: SocialMedia,
    location: Location,
    joined: Date,
    verified: true
}

export type AthleteAvatar = {
    small: string
}