import mongoose from 'mongoose';

/**
 * @description holds account model
 */

/**
 * IAccount interface
 */
export interface IAccount extends mongoose.Document {
  id: string;
  authzId: string;
  phoneNumber: string;
  transform: () => IAccount;
}

/**
 * account schema
 */
const schema: mongoose.SchemaDefinition = {
  authzId: { type: mongoose.SchemaTypes.String, required: true, index: true, unique: true },
  phoneNumber: { type: mongoose.SchemaTypes.String, required: true, unique: true },
};

// account collection name
const collectionName = 'account';

const accountSchema: mongoose.Schema<IAccount> = new mongoose.Schema<IAccount>(schema);

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
export const AccountModel = (conn: mongoose.Connection): mongoose.Model<IAccount> => {
  return conn.model<IAccount>(collectionName, accountSchema);
};
