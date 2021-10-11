import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

export interface IShortLinkModel extends Document {
  slug: string;
  link: string;
  entity?: string;
}

export const ShortLinkCollectionName = 'short_links';

const ShortLinkSchema: Schema<IShortLinkModel> = new Schema<IShortLinkModel>({
  slug: { type: SchemaTypes.String, required: true },
  link: { type: SchemaTypes.String, required: true },
  entity: { type: SchemaTypes.String },
});

export const ShortLinkModel = (connection: Connection): Model<IShortLinkModel> =>
  connection.model<IShortLinkModel>(ShortLinkCollectionName, ShortLinkSchema);
