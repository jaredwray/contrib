import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

export interface IShortLinkModel extends Document {
  slug: string;
  link: string;
  //TODO delete after update short_links
  entity?: string;
  //TODO ends
}

export const ShortLinkCollectionName = 'short_links';

const ShortLinkSchema: Schema<IShortLinkModel> = new Schema<IShortLinkModel>({
  slug: { type: SchemaTypes.String, required: true },
  link: { type: SchemaTypes.String, required: true },
  //TODO delete after update short_links
  entity: { type: SchemaTypes.String },
  //TODO ends
});

export const ShortLinkModel = (connection: Connection): Model<IShortLinkModel> =>
  connection.model<IShortLinkModel>(ShortLinkCollectionName, ShortLinkSchema);
