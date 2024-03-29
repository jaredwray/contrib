import dayjs, { Dayjs } from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { CharityStatus } from '../dto/CharityStatus';
import { CharityProfileStatus } from '../dto/CharityProfileStatus';
import { CharityStripeStatus } from '../dto/CharityStripeStatus';
import { IUserAccount, UserAccountCollectionName, IFollowObject } from '../../UserAccount/mongodb/UserAccountModel';

export interface ICharityModel extends Document {
  semanticIds: string[];
  name: string;
  status: CharityStatus;
  profileStatus: CharityProfileStatus;
  stripeStatus: CharityStripeStatus;
  userAccount: IUserAccount['_id'];
  stripeAccountId: string | null;
  avatarUrl?: string;
  profileDescription: string | null;
  website: string | null;
  totalRaisedAmount: number;
  followers: IFollowObject[];
  activatedAt: Dayjs;
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
  onboardedAt?: Dayjs;
}

export const CharityCollectionName = 'charity';

const CharitySchema: Schema<ICharityModel> = new Schema<ICharityModel>({
  semanticIds: [{ type: SchemaTypes.String, required: true }],
  name: { type: SchemaTypes.String, required: true },
  status: { type: SchemaTypes.String, required: true, index: true },
  profileStatus: { type: SchemaTypes.String, required: true },
  stripeStatus: { type: SchemaTypes.String },
  userAccount: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName, index: true },
  stripeAccountId: { type: SchemaTypes.String },
  avatarUrl: { type: SchemaTypes.String },
  profileDescription: { type: SchemaTypes.String },
  website: { type: SchemaTypes.String },
  totalRaisedAmount: { type: SchemaTypes.Number, default: 0 },
  activatedAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
  createdAt: {
    type: SchemaTypes.Date,
    default: dayjs().second(0),
    get: (v) => dayjs(v),
  },
  updatedAt: {
    type: SchemaTypes.Date,
    default: dayjs().second(0),
    get: (v) => dayjs(v),
  },
  onboardedAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
  followers: [
    {
      user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
      createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
    },
  ],
});
CharitySchema.index({ name: 'text' });
export const CharityModel = (connection: Connection): Model<ICharityModel> =>
  connection.model<ICharityModel>(CharityCollectionName, CharitySchema);
