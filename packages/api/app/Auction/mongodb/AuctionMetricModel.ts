import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { IAuctionModel, AuctionCollectionName } from './AuctionModel';

export interface IAuctionMetricModel extends Document {
  auction: IAuctionModel['_id'];
  metrics: object[];
}

export const AuctionMetricCollectionName = 'auction_metrics';

const AuctionMetricSchema: Schema<IAuctionMetricModel> = new Schema<IAuctionMetricModel>({
  auction: { type: SchemaTypes.ObjectId, ref: 'auction' },
  metrics: [
    {
      date: { type: SchemaTypes.Date },
      country: { type: SchemaTypes.String },
      referrer: { type: SchemaTypes.String },
      userAgentData: { type: SchemaTypes.String },
    },
  ],
});

export const AuctionMetricModel = (connection: Connection): Model<IAuctionMetricModel> =>
  connection.model<IAuctionMetricModel>(AuctionMetricCollectionName, AuctionMetricSchema);
