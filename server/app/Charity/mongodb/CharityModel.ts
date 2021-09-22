import dayjs, { Dayjs } from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { CharityStatus } from '../dto/CharityStatus';
import { CharityProfileStatus } from '../dto/CharityProfileStatus';
import { CharityStripeStatus } from '../dto/CharityStripeStatus';
import { IUserAccount, UserAccountCollectionName, IFollowObject } from '../../UserAccount/mongodb/UserAccountModel';

export interface ICharityModel extends Document {
  name: string;
  status: CharityStatus;
  profileStatus: CharityProfileStatus;
  stripeStatus: CharityStripeStatus;
  userAccount: IUserAccount['_id'];
  stripeAccountId: string | null;
  avatarUrl: string | null;
  profileDescription: string | null;
  website: string | null;
  activatedAt: Dayjs;
  followers: IFollowObject[];
}

export const CharityCollectionName = 'charity';

const CharitySchema: Schema<ICharityModel> = new Schema<ICharityModel>({
  name: { type: SchemaTypes.String, required: true },
  status: { type: SchemaTypes.String, required: true },
  profileStatus: { type: SchemaTypes.String, required: true },
  stripeStatus: { type: SchemaTypes.String },
  userAccount: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  stripeAccountId: { type: SchemaTypes.String },
  avatarUrl: { type: SchemaTypes.String },
  profileDescription: { type: SchemaTypes.String },
  website: { type: SchemaTypes.String },
  activatedAt: {
    type: SchemaTypes.Date,
    get: (v) => dayjs(v),
  },
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
