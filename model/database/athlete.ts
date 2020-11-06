import { ObjectID } from 'mongodb'
import { CharitySupport } from './charitySupport'
import { SocialMedia } from './socialMedia'

// An Athlete is a member of the sporting community who
// has joined Contrib in order to sell items for Charity.
export type Athlete = {
    _id: ObjectID,
    name: string,
    description: string,
    charities: CharitySupport[],
    avatar: AthleteAvatar,    
    social: SocialMedia,
}

export type AthleteAvatar = {
    small: string
}