import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { AssetType } from '../dto/AuctionAssets';

export interface IAuctionAssetModel extends Document {
  uid: string;
  url: string;
  thumbnail: string;
  type: AssetType;
}

export const AuctionAssetCollectionName = 'auction_asset';

const AuctionAssetSchema: Schema<IAuctionAssetModel> = new Schema<IAuctionAssetModel>({
  url: { type: SchemaTypes.String, required: true },
  type: { type: SchemaTypes.String, default: AssetType.IMAGE },
  uid: { type: SchemaTypes.String },
  thumbnail: { type: SchemaTypes.String },
});

export const AuctionAssetModel = (connection: Connection): Model<IAuctionAssetModel> =>
  connection.model<IAuctionAssetModel>(AuctionAssetCollectionName, AuctionAssetSchema);
