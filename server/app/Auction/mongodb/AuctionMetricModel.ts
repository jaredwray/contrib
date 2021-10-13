import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { IAuctionModel, AuctionCollectionName } from './AuctionModel';

export interface IAuctionMetricModel extends Document {
  auction: IAuctionModel['_id'];
  clicks: object[];
  referrers: object[];
  countries: object[];
}

export const AuctionMetricCollectionName = 'auction_metrics';

const AuctionMetricSchema: Schema<IAuctionMetricModel> = new Schema<IAuctionMetricModel>({
  auction: { type: SchemaTypes.ObjectId, ref: 'auction' },
  clicks: { type: SchemaTypes.Array },
  referrers: { type: SchemaTypes.Array },
  countries: { type: SchemaTypes.Array },
});

export const AuctionMetricModel = (connection: Connection): Model<IAuctionMetricModel> =>
  connection.model<IAuctionMetricModel>(AuctionMetricCollectionName, AuctionMetricSchema);
