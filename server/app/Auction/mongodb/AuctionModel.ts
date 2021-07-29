import dayjs from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

import { UserAccountCollectionName, IFollowObject, IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';
import { AppConfig } from '../../../config';
import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionParcel } from '../dto/AuctionParcel';
import { AuctionAssetCollectionName, IAuctionAssetModel } from './AuctionAssetModel';
import { InfluencerCollectionName, IInfluencer } from '../../Influencer/mongodb/InfluencerModel';

export interface IAuctionModel extends Document {
  title: string;
  status: AuctionStatus;
  autographed: boolean;
  sport: string;
  gameWorn: boolean;
  description: string;
  followers: IFollowObject[];
  parcel: AuctionParcel;
  fullPageDescription: string;
  auctionOrganizer: IInfluencer['_id'];
  assets: IAuctionAssetModel['_id'][];
  currentPrice: number;
  itemPrice?: number;
  priceCurrency?: string;
  charity: ICharityModel['_id'];
  startsAt: dayjs.Dayjs;
  endsAt: dayjs.Dayjs;
  stoppedAt: dayjs.Dayjs;
  startPrice: number;
  link: string;
  fairMarketValue: number;
  timeZone: string;
  sentNotifications: [string];
  totalBids: number;
  winner?: IUserAccount['_id'];
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
    sentNotifications: { type: SchemaTypes.Array, default: [] },
    authenticityCertificate: { type: SchemaTypes.Boolean, default: false },
    gameWorn: { type: SchemaTypes.Boolean, default: false },
    parcel: {
      width: { type: SchemaTypes.Number, default: AppConfig.delivery.auctionParcel.width },
      length: { type: SchemaTypes.Number, default: AppConfig.delivery.auctionParcel.length },
      height: { type: SchemaTypes.Number, default: AppConfig.delivery.auctionParcel.height },
      weight: { type: SchemaTypes.Number, default: AppConfig.delivery.auctionParcel.weight },
      units: { type: SchemaTypes.String, default: AppConfig.delivery.auctionParcel.units },
    },
    followers: [
      {
        user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
        createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
      },
    ],
    startPrice: { type: SchemaTypes.Number, default: 0 },
    itemPrice: { type: SchemaTypes.Number },
    priceCurrency: { type: SchemaTypes.String, default: AppConfig.app.defaultCurrency },
    currentPrice: { type: SchemaTypes.Number, default: 0 },
    playedIn: { type: SchemaTypes.String },
    assets: [{ type: SchemaTypes.ObjectId, ref: AuctionAssetCollectionName }],
    auctionOrganizer: { type: SchemaTypes.ObjectId, ref: InfluencerCollectionName },
    startsAt: {
      type: SchemaTypes.Date,
      default: dayjs().second(0).toISOString(),
      get: (v) => dayjs(v),
    },
    endsAt: { type: SchemaTypes.Date, default: dayjs().second(0).toISOString(), get: (v) => dayjs(v) },
    stoppedAt: { type: SchemaTypes.Date },
    link: { type: SchemaTypes.String },
    fairMarketValue: { type: SchemaTypes.Number },
    timeZone: { type: SchemaTypes.String },
    totalBids: { type: SchemaTypes.Number, default: 0 },
    winner: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  },
  { optimisticConcurrency: true },
);

AuctionSchema.index({ startsAt: 1, endsAt: 1 });

export const AuctionModel = (connection: Connection): Model<IAuctionModel> =>
  connection.model<IAuctionModel>(AuctionCollectionName, AuctionSchema);
