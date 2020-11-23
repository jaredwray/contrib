import { ObjectId } from 'mongodb'
import { UserId } from './user'

export type AccountId = ObjectId

// An Account is a social login that is associated with a
// User and contains appropriate oauth tokens.
export type Account = {
    _id: AccountId,
    compoundId: string,
    userId: UserId,
    providerType: 'oauth',
    providerId: 'facebook' | 'twitter' | 'google',
    providerAccountId: string,
    refreshToken: string | null,
    accessToken: string,
    accessTokenExpires: Date | null,
    createdAt: Date,
    updatedAt: Date
}
