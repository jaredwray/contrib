import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

export interface IUserAccount extends Document {
  authzId: string;
  phoneNumber: string;
  isAdmin: boolean;
  stripeCustomerId: string | null;
}

export const UserAccountCollectionName = 'account';

const UserAccountSchema: Schema<IUserAccount> = new Schema<IUserAccount>({
  authzId: { type: SchemaTypes.String, required: true, index: true, unique: true },
  phoneNumber: { type: SchemaTypes.String, required: true, unique: true },
  isAdmin: { type: SchemaTypes.Boolean, required: false },
  stripeCustomerId: { type: SchemaTypes.String, required: false },
});

export const UserAccountModel = (connection: Connection): Model<IUserAccount> => {
  return connection.model<IUserAccount>(UserAccountCollectionName, UserAccountSchema);
};
