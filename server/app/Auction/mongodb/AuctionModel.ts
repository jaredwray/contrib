import dayjs from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import Dinero from 'dinero.js';

import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionAssetCollectionName, IAuctionAssetModel } from './AuctionAssetModel';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';
import { InfluencerCollectionName } from '../../Influencer/mongodb/InfluencerModel';

export interface IAuctionBid {
  user: IUserAccount['_id'];
  createdAt: dayjs.Dayjs;
  paymentSource: string;
  bid: number;
  bidCurrency: Dinero.Currency;
  chargeId: string;
}

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
  bids: IAuctionBid[];
  currentPrice: number;
  currentPriceCurrency: string;
  itemPrice?: number;
  itemPriceCurrency?: string;
  charity: ICharityModel['_id'];
  startsAt: dayjs.Dayjs;
  endsAt: dayjs.Dayjs;
  startPriceCurrency: string;
  startPrice: number;
  link: string;
  fairMarketValue: number;
  fairMarketValueCurrency: string;
  timeZone: string;
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
    bids: [
      {
        user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
        bid: { type: SchemaTypes.Number, required: true },
        bidCurrency: { type: SchemaTypes.String, default: 'USD' },
        paymentSource: { type: SchemaTypes.String, required: true },
        createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
        chargeId: { type: SchemaTypes.String },
      },
    ],
    startPrice: { type: SchemaTypes.Number, default: 0 },
    startPriceCurrency: { type: SchemaTypes.String, default: 'USD' },
    itemPrice: { type: SchemaTypes.Number },
    itemPriceCurrency: { type: SchemaTypes.String, default: 'USD' },
    currentPrice: { type: SchemaTypes.Number, default: 0 },
    currentPriceCurrency: { type: SchemaTypes.String, default: 'USD' },
    playedIn: { type: SchemaTypes.String },
    assets: [{ type: SchemaTypes.ObjectId, ref: AuctionAssetCollectionName }],
    auctionOrganizer: { type: SchemaTypes.ObjectId, ref: InfluencerCollectionName },
    startsAt: { type: SchemaTypes.Date, default: dayjs().toISOString(), get: (v) => dayjs(v) },
    endsAt: { type: SchemaTypes.Date, default: dayjs().toISOString(), get: (v) => dayjs(v) },
    link: { type: SchemaTypes.String },
    fairMarketValue: { type: SchemaTypes.Number },
    fairMarketValueCurrency: { type: SchemaTypes.String },
    timeZone: { type: SchemaTypes.String, default: 'EST' },
    isActive: { type: SchemaTypes.Boolean },
    isDraft: { type: SchemaTypes.Boolean },
    isPending: { type: SchemaTypes.Boolean },
    isSettled: { type: SchemaTypes.Boolean },
    isFailed: { type: SchemaTypes.Boolean },
  },
  { optimisticConcurrency: true },
);

AuctionSchema.index({ startsAt: 1, endsAt: 1 });

export const AuctionModel = (connection: Connection): Model<IAuctionModel> =>
  connection.model<IAuctionModel>(AuctionCollectionName, AuctionSchema);
