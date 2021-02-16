import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

export interface IUserAccount extends Document {
  authzId: string;
  phoneNumber: string;
}

export const UserAccountCollectionName = 'account';

const UserAccountSchema: Schema<IUserAccount> = new Schema<IUserAccount>({
  authzId: { type: SchemaTypes.String, required: true, index: true, unique: true },
  phoneNumber: { type: SchemaTypes.String, required: true, unique: true },
});

export const UserAccountModel = (connection: Connection): Model<IUserAccount> => {
  return connection.model<IUserAccount>(UserAccountCollectionName, UserAccountSchema);
};
