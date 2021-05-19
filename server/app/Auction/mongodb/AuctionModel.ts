import dayjs from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes, Types } from 'mongoose';

import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionBidCollectionName, IAuctionBidModel } from './AuctionBidModel';
import { AuctionAssetCollectionName, IAuctionAssetModel } from './AuctionAssetModel';
import { IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';
import arrayMax from '../../../helpers/arrayMax';
import { InfluencerCollectionName } from '../../Influencer/mongodb/InfluencerModel';

export interface IAuctionModel extends Document {
  title: string;
  status: AuctionStatus;
  autographed: boolean;
  sport: string;
  gameWorn: boolean;
  description: string;
  fullPageDescription: string;
  auctionOrganizer: IUserAccount['_id'];
  assets: IAuctionAssetModel[];
  bids: IAuctionBidModel['_id'][];
  maxBid: IAuctionBidModel['_id'];
  charity: ICharityModel['_id'];
  startsAt: dayjs.Dayjs;
  endsAt: dayjs.Dayjs;
  startPriceCurrency: string;
  startPrice: number;
  link: string;
  fairMarketValue: number;
  fairMarketValueCurrency: string;
}

export const AuctionCollectionName = 'auction';

const AuctionSchema: Schema<IAuctionModel> = new Schema<IAuctionModel>(
  {
    title: { type: SchemaTypes.String, required: true },
    sport: { type: SchemaTypes.String, default: '' },
    description: { type: SchemaTypes.String, default: '' },
    fullPageDescription: { type: SchemaTypes.String, default: '' },
    status: { type: SchemaTypes.String, default: AuctionStatus.DRAFT },
    charity: { type: SchemaTypes.ObjectId, ref: CharityCollectionName },
    autographed: { type: SchemaTypes.Boolean, default: false },
    authenticityCertificate: { type: SchemaTypes.Boolean, default: false },
    gameWorn: { type: SchemaTypes.Boolean, default: false },
    bids: [{ type: SchemaTypes.ObjectId, ref: AuctionBidCollectionName }],
    maxBid: { type: SchemaTypes.ObjectId, ref: AuctionBidCollectionName },
    startPriceCurrency: { type: SchemaTypes.String, default: 'USD' },
    startPrice: { type: SchemaTypes.Number, default: 0 },
    playedIn: { type: SchemaTypes.String },
    assets: [{ type: SchemaTypes.ObjectId, ref: AuctionAssetCollectionName }],
    auctionOrganizer: { type: SchemaTypes.ObjectId, ref: InfluencerCollectionName },
    startsAt: { type: SchemaTypes.Date, default: dayjs().toISOString(), get: (v) => dayjs(v) },
    endsAt: { type: SchemaTypes.Date, default: dayjs().toISOString(), get: (v) => dayjs(v) },
    link: { type: SchemaTypes.String },
    fairMarketValue: { type: SchemaTypes.Number, default: 0 },
    fairMarketValueCurrency: { type: SchemaTypes.String, default: 'USD' },
  },
  { optimisticConcurrency: true },
);

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
