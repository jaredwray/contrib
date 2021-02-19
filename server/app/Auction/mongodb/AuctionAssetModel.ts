import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { AssetType } from '../dto/AuctionAssets';

export interface IAuctionAssetModel extends Document {
  url: string;
  type: AssetType;
}

export const AuctionAssetCollectionName = 'auctionAsset';

const AuctionAssetSchema: Schema<IAuctionAssetModel> = new Schema<IAuctionAssetModel>({
  url: { type: SchemaTypes.String, required: true },
  type: { type: SchemaTypes.String, default: AssetType.IMAGE },
});

export const AuctionAssetModel = (connection: Connection): Model<IAuctionAssetModel> =>
  connection.model<IAuctionAssetModel>(AuctionAssetCollectionName, AuctionAssetSchema);
