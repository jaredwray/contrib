import dayjs from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

import { UserAccountCollectionName, IFollowObject, IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';
import { AppConfig } from '../../../config';
import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';
import { ShortLinkCollectionName, IShortLinkModel } from '../../ShortLink/mongodb/ShortLinkModel';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionDelivery } from '../dto/AuctionDelivery';
import { AuctionAssetCollectionName, IAuctionAssetModel } from './AuctionAssetModel';
import { InfluencerCollectionName, IInfluencer } from '../../Influencer/mongodb/InfluencerModel';

export interface IAuctionModel extends Document {
  title: string;
  status: AuctionStatus;
  followers: IFollowObject[];
  delivery: AuctionDelivery;
  description: string;
  auctionOrganizer: IInfluencer['_id'];
  assets: IAuctionAssetModel['_id'][];
  currentPrice: number;
  itemPrice?: number;
  bidStep: number;
  priceCurrency?: string;
  charity: ICharityModel['_id'];
  startPrice: number;
  bitlyLink: string;
  shortLink: IShortLinkModel['_id'];
  fairMarketValue: number;
  sentNotifications: [string];
  totalBids: number;
  winner?: IUserAccount['_id'];
  createdAt: dayjs.Dayjs;
  updatedAt: dayjs.Dayjs;
  startsAt: dayjs.Dayjs;
  endsAt: dayjs.Dayjs;
  stoppedAt: dayjs.Dayjs;
}

export const AuctionCollectionName = 'auction';

const AuctionSchema: Schema<IAuctionModel> = new Schema<IAuctionModel>(
  {
    title: { type: SchemaTypes.String, required: true },
    description: { type: SchemaTypes.String },
    status: { type: SchemaTypes.String, default: AuctionStatus.DRAFT },
    charity: { type: SchemaTypes.ObjectId, ref: CharityCollectionName },
    sentNotifications: { type: SchemaTypes.Array, default: [] },
    followers: [
      {
        user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
        createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
      },
    ],
    startPrice: { type: SchemaTypes.Number, default: 10000 },
    itemPrice: { type: SchemaTypes.Number },
    priceCurrency: { type: SchemaTypes.String, default: AppConfig.app.defaultCurrency },
    currentPrice: { type: SchemaTypes.Number, default: 0 },
    bidStep: { type: SchemaTypes.Number, default: 1000 },
    assets: [{ type: SchemaTypes.ObjectId, ref: AuctionAssetCollectionName }],
    auctionOrganizer: { type: SchemaTypes.ObjectId, ref: InfluencerCollectionName },
    startsAt: {
      type: SchemaTypes.Date,
      get: (v) => dayjs(v),
    },
    endsAt: {
      type: SchemaTypes.Date,
      get: (v) => dayjs(v),
    },
    stoppedAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
    createdAt: {
      type: SchemaTypes.Date,
      get: (v) => dayjs(v),
    },
    updatedAt: {
      type: SchemaTypes.Date,
      get: (v) => dayjs(v),
    },
    bitlyLink: { type: SchemaTypes.String },
    shortLink: { type: SchemaTypes.ObjectId, ref: ShortLinkCollectionName },
    fairMarketValue: { type: SchemaTypes.Number },
    totalBids: { type: SchemaTypes.Number, default: 0 },
    winner: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
    delivery: {
      deliveryMethod: { type: SchemaTypes.String },
      shippingLabel: { type: SchemaTypes.String },
      parcel: {
        width: { type: SchemaTypes.String },
        length: { type: SchemaTypes.String },
        height: { type: SchemaTypes.String },
        weight: { type: SchemaTypes.String },
      },
      address: {
        name: { type: SchemaTypes.String },
        state: { type: SchemaTypes.String },
        city: { type: SchemaTypes.String },
        zipCode: { type: SchemaTypes.String },
        country: { type: SchemaTypes.String, default: 'USA' },
        street: { type: SchemaTypes.String },
        phoneNumber: { type: SchemaTypes.String },
      },
      status: { type: SchemaTypes.String },
      updatedAt: { type: SchemaTypes.Date },
      identificationNumber: { type: SchemaTypes.String },
      timeInTransit: { type: SchemaTypes.Date },
    },
  },
  { optimisticConcurrency: true },
);

AuctionSchema.index({ startsAt: 1, endsAt: 1 });

export const AuctionModel = (connection: Connection): Model<IAuctionModel> =>
  connection.model<IAuctionModel>(AuctionCollectionName, AuctionSchema);
