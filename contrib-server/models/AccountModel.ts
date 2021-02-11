import { Document, SchemaDefinition, SchemaTypes, Schema, Connection, Model } from 'mongoose';

/**
 * @description holds account model
 */

/**
 * IAccount interface
 */
export interface IAccount extends Document {
  id: string;
  authzId: string;
  phoneNumber: string;
  transform: () => IAccount;
}

/**
 * account schema
 */
const schema: SchemaDefinition = {
  authzId: { type: SchemaTypes.String, required: true, index: true, unique: true },
  phoneNumber: { type: SchemaTypes.String, required: true, unique: true },
};

// account collection name
const collectionName = 'account';

const accountSchema: Schema<IAccount> = new Schema<IAccount>(schema);

/**
 * transforms account object
 * changes _id to id
 */
accountSchema.methods.transform = function () {
  const obj = this.toObject();
  const id = obj._id;
  delete obj._id;
  obj.id = id;

  return obj;
};

/**
 * creates account model
 * @param conn database connection
 * @returns account model
 */
export const AccountModel = (conn: Connection): Model<IAccount> => {
  return conn.model<IAccount>(collectionName, accountSchema);
};
