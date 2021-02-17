import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

export interface ICharityModel extends Document {
  name: string;
}

export const CharityCollectionName = 'charity';

const CharitySchema: Schema<ICharityModel> = new Schema<ICharityModel>({
  name: { type: SchemaTypes.String, required: true },
});

CharitySchema.index({ name: 'text' });

export const CharityModel = (connection: Connection): Model<ICharityModel> =>
  connection.model<ICharityModel>(CharityCollectionName, CharitySchema);
