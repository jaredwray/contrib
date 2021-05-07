import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { StripeCharityStatus } from '../dto/StripeCharityStatus';
import { CharityProfileStatus } from '../dto/CharityProfileStatus';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';
import { CharityStatus } from '../../../../client/src/types/Charity';

export interface ICharityModel extends Document {
  name: string;
  stripeStatus: StripeCharityStatus;
  profileStatus: CharityProfileStatus;
  userAccount: IUserAccount['_id'];
  stripeAccountId: string | null;
  avatarUrl: string | null;
  profileDescription: string | null;
  websiteUrl: string | null;
  status: CharityStatus;
}

export const CharityCollectionName = 'charity';

const CharitySchema: Schema<ICharityModel> = new Schema<ICharityModel>({
  name: { type: SchemaTypes.String, required: true },
  stripeStatus: { type: SchemaTypes.String },
  profileStatus: { type: SchemaTypes.String, required: true },
  status: { type: SchemaTypes.String, required: true },
  userAccount: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  stripeAccountId: { type: SchemaTypes.String },
  avatarUrl: { type: SchemaTypes.String },
  profileDescription: { type: SchemaTypes.String },
  websiteUrl: { type: SchemaTypes.String },
});
CharitySchema.index({ name: 'text' });
export const CharityModel = (connection: Connection): Model<ICharityModel> =>
  connection.model<ICharityModel>(CharityCollectionName, CharitySchema);
