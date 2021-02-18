import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionBidCollectionName, IAuctionBidModel } from './AuctionBidModel';
import { Dayjs } from 'dayjs';

export interface IAuctionModel extends Document {
  title: string;
  status: AuctionStatus;
  charity: ICharityModel['_id'];
  bids: IAuctionBidModel['_id'][];
  startsAt: Dayjs;
  endsAt: Dayjs;
}

export const AuctionCollectionName = 'auction';

const AuctionSchema: Schema<IAuctionModel> = new Schema<IAuctionModel>({
  title: { type: SchemaTypes.String, required: true },
  status: { type: SchemaTypes.String, required: true },
  charity: { type: SchemaTypes.ObjectId, ref: CharityCollectionName, required: true },
  bids: { type: SchemaTypes.ObjectId, ref: AuctionBidCollectionName },
  startsAt: { type: SchemaTypes.String, required: true },
  endsAt: { type: SchemaTypes.String, required: true },
});

AuctionSchema.post('init', (doc) => {
  console.log(doc);
});

export const AuctionModel = (connection: Connection): Model<IAuctionModel> =>
  connection.model<IAuctionModel>(AuctionCollectionName, AuctionSchema);
