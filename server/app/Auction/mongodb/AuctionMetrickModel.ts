import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { IAuctionModel, AuctionCollectionName } from './AuctionModel';

export interface IAuctionMetrickModel extends Document {
  auction: IAuctionModel['_id'];
  clicks: object[];
  referrers: object[];
  countries: object[];
}

export const AuctionMetrickCollectionName = 'auction_metrics';

const AuctionMetricSchema: Schema<IAuctionMetrickModel> = new Schema<IAuctionMetrickModel>({
  auction: { type: SchemaTypes.ObjectId, ref: 'auction' },
  clicks: { type: SchemaTypes.Array },
  referrers: { type: SchemaTypes.Array },
  countries: { type: SchemaTypes.Array },
});

export const AuctionMetrickModel = (connection: Connection): Model<IAuctionMetrickModel> =>
  connection.model<IAuctionMetrickModel>(AuctionMetrickCollectionName, AuctionMetricSchema);
