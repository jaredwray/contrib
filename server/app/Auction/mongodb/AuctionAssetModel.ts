import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { AssetType } from '../dto/AuctionAssets';

export interface IAuctionAssetModel extends Document {
  type: AssetType;
  url: string;
  cloudflareUrl: string;
  thumbnail: string;
  uid: string;
}

export const AuctionAssetCollectionName = 'auction_asset';

const AuctionAssetSchema: Schema<IAuctionAssetModel> = new Schema<IAuctionAssetModel>({
  type: { type: SchemaTypes.String, default: AssetType.IMAGE, required: true },
  url: { type: SchemaTypes.String, required: true },
  cloudflareUrl: { type: SchemaTypes.String },
  uid: { type: SchemaTypes.String },
  thumbnail: { type: SchemaTypes.String },
});

export const AuctionAssetModel = (connection: Connection): Model<IAuctionAssetModel> =>
  connection.model<IAuctionAssetModel>(AuctionAssetCollectionName, AuctionAssetSchema);
