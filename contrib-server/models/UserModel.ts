import { Document, SchemaDefinition, SchemaTypes, Schema, Connection, Model } from 'mongoose';

/**
 * @description holds user model
 */

/**
 * User interface
 */
export interface IUser extends Document {
  id: string;
  name: string;
  password: string;
  email: string;
  transform: () => IUser;
}

/**
 * user schema
 */
const schema: SchemaDefinition = {
  name: { type: SchemaTypes.String, required: true, unique: true },
  password: { type: SchemaTypes.String, required: true },
  email: { type: SchemaTypes.String, required: true },
};

// user collection name
const collectionName = 'user';

const userSchema: Schema<IUser> = new Schema<IUser>(schema);

/**
 * transforms user object, removes password and
 * changes _id to id
 */
userSchema.methods.transform = function () {
  const obj = this.toObject();
  delete obj.password;

  const id = obj._id;
  delete obj._id;
  obj.id = id;

  return obj;
};

/**
 * creates user model
 * @param conn database connection
 * @returns user model
 */
const UserModel = (conn: Connection): Model<IUser> => {
  return conn.model<IUser>(collectionName, userSchema);
};

export default UserModel;
