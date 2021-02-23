import * as dayjs from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes, Types } from 'mongoose';

import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionBidCollectionName, IAuctionBidModel } from './AuctionBidModel';
import { AuctionAssetCollectionName, IAuctionAssetModel } from './AuctionAssetModel';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';
import arrayMax from '../../../helpers/arrayMax';

export interface IAuctionModel extends Document {
  title: string;
  status: AuctionStatus;
  autographed: boolean;
  sport: string;
  gameWorn: boolean;
  description: string;
  fullpageDescription: string;
  auctionOrganizer: IUserAccount['_id'];
  assets: IAuctionAssetModel[];
  bids: IAuctionBidModel['_id'][];
  maxBid: IAuctionBidModel['_id'];
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
  maxBid: { type: SchemaTypes.ObjectId, ref: AuctionBidCollectionName },
  assets: [{ type: SchemaTypes.ObjectId, ref: AuctionAssetCollectionName }],
  auctionOrganizer: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  startsAt: { type: SchemaTypes.Date, default: dayjs().toISOString(), get: (v) => dayjs(v) },
  endsAt: { type: SchemaTypes.Date, default: dayjs().toISOString(), get: (v) => dayjs(v) },
});

AuctionSchema.pre('save', async function (next) {
  await this.populate({ path: 'bids' }).execPopulate();
  if (this.bids.length) {
    const maxBid = arrayMax<IAuctionBidModel>(this.bids, (currentBid, prevBid) =>
      currentBid.bidMoney.greaterThan(prevBid.bidMoney),
    );
    this.maxBid = Types.ObjectId(maxBid._id);
  }
  next();
});

AuctionSchema.index({ startsAt: 1, endsAt: 1, maxBid: 1 });

export const AuctionModel = (connection: Connection): Model<IAuctionModel> =>
  connection.model<IAuctionModel>(AuctionCollectionName, AuctionSchema);
