import dayjs, { Dayjs } from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

import { InfluencerCollectionName, IInfluencer } from './../../Influencer/mongodb/InfluencerModel';
import { AuctionCollectionName, IAuctionModel } from '../../Auction/mongodb/AuctionModel';
import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';
import { UserAccountAddress } from '../dto/UserAccountAddress';

export interface IFollowObject {
  user?: IUserAccount['_id'];
  influencerProfile?: IInfluencer['_id'];
  charityProfile?: ICharityModel['_id'];
  auction?: IAuctionModel['_id'];
  createdAt: Dayjs;
}

export interface IUserAccount extends Document {
  authzId: string;
  phoneNumber: string;
  isAdmin: boolean;
  stripeCustomerId: string | null;
  createdAt: Dayjs;
  updatedAt?: Dayjs;
  acceptedTerms: string;
  acceptedTermsAt: Dayjs;
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
  createdAt: {
    type: SchemaTypes.Date,
    default: dayjs().second(0),
    get: (v) => dayjs(v),
  },
  updatedAt: {
    type: SchemaTypes.Date,
    get: (v) => dayjs(v),
  },
  acceptedTerms: { type: SchemaTypes.String },
  acceptedTermsAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
  followingAuctions: [
    {
      auction: { type: SchemaTypes.ObjectId, ref: 'auction' },
      createdAt: {
        type: SchemaTypes.Date,
        default: dayjs().second(0),
        get: (v) => dayjs(v),
      },
    },
  ],
  followingInfluencers: [
    {
      influencerProfile: { type: SchemaTypes.ObjectId, ref: 'influencer' },
      createdAt: {
        type: SchemaTypes.Date,
        default: dayjs().second(0),
        get: (v) => dayjs(v),
      },
    },
  ],
  followingCharitis: [
    {
      charityProfile: { type: SchemaTypes.ObjectId, ref: 'charity' },
      createdAt: {
        type: SchemaTypes.Date,
        default: dayjs().second(0),
        get: (v) => dayjs(v),
      },
    },
  ],
  address: {
    name: { type: SchemaTypes.String },
    state: { type: SchemaTypes.String },
    city: { type: SchemaTypes.String },
    zipCode: { type: SchemaTypes.String },
    country: { type: SchemaTypes.String, default: 'USA' },
    street: { type: SchemaTypes.String },
    phoneNumber: { type: SchemaTypes.String },
  },
});

export const UserAccountModel = (connection: Connection): Model<IUserAccount> => {
  return connection.model<IUserAccount>(UserAccountCollectionName, UserAccountSchema);
};
