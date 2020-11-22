import { ObjectId } from 'mongodb'

export type UserId = ObjectId

// A User is somebody who can log into the site.
// What roles they can perform is dependent upon other factors.
// Much of this information is initially populated when signing up
// with a social provider.
export type User = {
    _id: UserId,
    email: string,
    firstName: string,
    lastName: string,
    auths: UserOAuth[],
    image: string
}

// A UserOAuth is a link between a User on Contrib and a
// socially-connected OAuth2 login. A user at some point
// in the future may use multiple but initially we will
// only support one as linking requires email verification etc.
export type UserOAuth = {
    provider: 'twitter' | 'google' | 'facebook' | 'apple',
    email: string,
    lastSuccessAt: Date
}
