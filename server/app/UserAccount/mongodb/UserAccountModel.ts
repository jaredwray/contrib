import dayjs, { Dayjs } from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

import { AuctionCollectionName, IAuctionModel } from '../../Auction/mongodb/AuctionModel';
import { UserAccountAddress } from '../dto/UserAccountAddress';

export interface IFollowObject {
  user?: IUserAccount['_id'];
  auction?: IAuctionModel['_id'];
  createdAt: Dayjs;
}

export interface IUserAccount extends Document {
  authzId: string;
  phoneNumber: string;
  isAdmin: boolean;
  stripeCustomerId: string | null;
  createdAt: Date;
  acceptedTerms: string;
  acceptedTermsAt: Date;
  address?: UserAccountAddress;
  followingInfluencers: IFollowObject[];
  followingCharitis: IFollowObject[];
  followingAuctions: IFollowObject[];
}

export const UserAccountCollectionName = 'account';

const UserAccountSchema: Schema<IUserAccount> = new Schema<IUserAccount>({
  authzId: { type: SchemaTypes.String, required: true, index: true, unique: true },
  phoneNumber: { type: SchemaTypes.String, required: true, unique: true },
  isAdmin: { type: SchemaTypes.Boolean, required: false },
  stripeCustomerId: { type: SchemaTypes.String, required: false },
  createdAt: { type: SchemaTypes.Date, required: true },
  acceptedTerms: { type: SchemaTypes.String },
  acceptedTermsAt: { type: SchemaTypes.Date },
  followingAuctions: [
    {
      auction: { type: SchemaTypes.ObjectId, ref: 'auction' },
      createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
    },
  ],
  followingInfluencers: [
    {
      user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
      createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
    },
  ],
  followingCharitis: [
    {
      user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
      createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
    },
  ],
  address: {
    name: { type: SchemaTypes.String },
    state: { type: SchemaTypes.String },
    city: { type: SchemaTypes.String },
    zipCode: { type: SchemaTypes.String },
    country: { type: SchemaTypes.String },
    street: { type: SchemaTypes.String },
  },
});

export const UserAccountModel = (connection: Connection): Model<IUserAccount> => {
  return connection.model<IUserAccount>(UserAccountCollectionName, UserAccountSchema);
};
