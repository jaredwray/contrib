import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { CharityStatus } from '../dto/CharityStatus';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';

export interface ICharityModel extends Document {
  name: string;
  status: CharityStatus;
  userAccount: IUserAccount['_id'];
  stripeAccountId: string;
  stripeAccountLink: string;
}

export const CharityCollectionName = 'charity';

const CharitySchema: Schema<ICharityModel> = new Schema<ICharityModel>({
  name: { type: SchemaTypes.String, required: true },
  status: { type: SchemaTypes.String, required: true },
  userAccount: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  stripeAccountId: { type: SchemaTypes.String },
  stripeAccountLink: { type: SchemaTypes.String },
});

CharitySchema.index({ name: 'text' });

export const CharityModel = (connection: Connection): Model<ICharityModel> =>
  connection.model<ICharityModel>(CharityCollectionName, CharitySchema);
