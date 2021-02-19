import * as dayjs from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionBidCollectionName, IAuctionBidModel } from './AuctionBidModel';
import { AuctionAssetCollectionName, IAuctionAssetModel } from './AuctionAssetModel';

export interface IAuctionModel extends Document {
  title: string;
  status: AuctionStatus;
  autographed: boolean;
  sport: string;
  gameWorn: boolean;
  assets: IAuctionAssetModel[];
  bids: IAuctionBidModel['_id'][];
  charity: ICharityModel['_id'];
  startsAt: dayjs.Dayjs;
  endsAt: dayjs.Dayjs;
}

export const AuctionCollectionName = 'auction';

const AuctionSchema: Schema<IAuctionModel> = new Schema<IAuctionModel>({
  title: { type: SchemaTypes.String, required: true },
  sport: { type: SchemaTypes.String, default: '' },
  description: { type: SchemaTypes.String, default: '' },
  fullpageDescription: { type: SchemaTypes.String, default: '' },
  status: { type: SchemaTypes.String, default: AuctionStatus.DRAFT },
  charity: { type: SchemaTypes.ObjectId, ref: CharityCollectionName },
  autographed: { type: SchemaTypes.Boolean, default: false },
  gameWorn: { type: SchemaTypes.Boolean, default: false },
  bids: [{ type: SchemaTypes.ObjectId, ref: AuctionBidCollectionName }],
  assets: [{ type: SchemaTypes.ObjectId, ref: AuctionAssetCollectionName }],
  startsAt: { type: SchemaTypes.Date, default: dayjs().toISOString(), get: (v) => dayjs(v) },
  endsAt: { type: SchemaTypes.Date, default: dayjs().toISOString(), get: (v) => dayjs(v) },
});

AuctionSchema.index({ startsAt: 1, endsAt: 1 });

export const AuctionModel = (connection: Connection): Model<IAuctionModel> =>
  connection.model<IAuctionModel>(AuctionCollectionName, AuctionSchema);
