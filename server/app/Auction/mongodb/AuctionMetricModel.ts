import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { IAuctionModel } from './AuctionModel';
import { BitlyClick } from '../dto/AuctionMetrics';
export interface IAuctionMetricModel extends Document {
  auction: IAuctionModel['_id'];
  clicks: [BitlyClick];
  referrers: object[];
  countries: object[];
  lastUpdateAt: string;
}
export const AuctionMetricCollectionName = 'auction_metrics';

const AuctionMetricSchema: Schema<IAuctionMetricModel> = new Schema<IAuctionMetricModel>({
  auction: { type: SchemaTypes.ObjectId, ref: 'auction' },
  clicks: { type: SchemaTypes.Array },
  referrers: { type: SchemaTypes.Array },
  countries: { type: SchemaTypes.Array },
  lastUpdateAt: { type: SchemaTypes.String },
});

export const AuctionMetricModel = (connection: Connection): Model<IAuctionMetricModel> =>
  connection.model<IAuctionMetricModel>(AuctionMetricCollectionName, AuctionMetricSchema);
