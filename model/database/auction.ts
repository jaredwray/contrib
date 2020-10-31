import { ObjectID } from 'mongodb'

export type Auction = {
    _id: ObjectID,
    title: string,
    seller: Seller,
    startAt: Date,
    endAt: Date,
    active: boolean,
    startPrice: number
}

export type Seller = {
    id: ObjectID,
    name: string
}

export type Location = {
    country: string,
    city: string,
    zip: number
}