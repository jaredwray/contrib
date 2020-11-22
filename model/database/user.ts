import { ObjectId } from 'mongodb'

export type UserId = ObjectId

// A User is somebody who can log into the site.
// What roles they can perform is dependent upon other factors.
// Much of this information is initially populated when signing up
// with a social provider.
export type User = {
    _id: UserId,
    name: string,
    email: string,
    image: string,
    createdAt: Date,
    updatedAt: Date
}
