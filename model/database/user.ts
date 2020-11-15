import { ObjectId } from 'mongodb'

export type UserId = ObjectId

// A User is somebody who can log into the site.
// What roles they can perform is dependent upon other factors.
export type User = {
    _id: UserId,
    email: string,
    firstName: string,
    lastName: string,
    auths: UserOAuth[]
}

// A UserOAuth is a link between a User on Contrib and a
// socially-connected OAuth2 login. A user at some point
// in the future may use multiple but initially we will
// only support one as linking requires more thought.
export type UserOAuth = {
    provider: 'twitter' | 'google' | 'facebook' | 'apple',
    email: string
}
