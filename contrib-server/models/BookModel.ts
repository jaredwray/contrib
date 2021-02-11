import { Document, SchemaDefinition, SchemaTypes, Schema, Connection, Model } from 'mongoose';

/**
 * @description holds book model
 */

/**
 * Book interface
 */
export interface IBook extends Document {
  id: string;
  name: string;
  description: string;
  transform: () => IBook;
}

/**
 * book schema
 */
const schema: SchemaDefinition = {
  name: { type: SchemaTypes.String, required: true, unique: true },
  description: { type: SchemaTypes.String, required: true },
};

// book collection name
const collectionName = 'book';

const bookSchema: Schema<IBook> = new Schema<IBook>(schema);

/**
 * transforms book object,
 * changes _id to id
 */
bookSchema.methods.transform = function () {
  const obj = this.toObject();

  const id = obj._id;
  delete obj._id;
  obj.id = id;

  return obj;
};

/**
 * creates book model
 * @param conn database connection
 * @returns book model
 */
const BookModel = (conn: Connection): Model<IBook> => {
  return conn.model(collectionName, bookSchema);
};

export default BookModel;
