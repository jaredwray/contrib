import dayjs from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

import { UserAccountCollectionName, IFollowObject, IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';
import { AppConfig } from '../../../config';
import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';
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
  priceCurrency?: string;
  charity: ICharityModel['_id'];
  startsAt: dayjs.Dayjs;
  endsAt: dayjs.Dayjs;
  stoppedAt: dayjs.Dayjs;
  startPrice: number;
  link: string;
  fairMarketValue: number;
  sentNotifications: [string];
  totalBids: number;
  winner?: IUserAccount['_id'];
}

export const AuctionCollectionName = 'auction';

const auctionDefaultParcelParameters = JSON.parse(AppConfig.delivery.UPSAuctionDefaultParcelParameters);

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
    assets: [{ type: SchemaTypes.ObjectId, ref: AuctionAssetCollectionName }],
    auctionOrganizer: { type: SchemaTypes.ObjectId, ref: InfluencerCollectionName },
    startsAt: {
      type: SchemaTypes.Date,
      default: dayjs().second(0).toISOString(),
      get: (v) => dayjs(v),
    },
    endsAt: { type: SchemaTypes.Date, default: dayjs().second(0).add(3, 'days').toISOString(), get: (v) => dayjs(v) },
    stoppedAt: { type: SchemaTypes.Date },
    link: { type: SchemaTypes.String },
    fairMarketValue: { type: SchemaTypes.Number },
    totalBids: { type: SchemaTypes.Number, default: 0 },
    winner: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
    delivery: {
      parcel: {
        width: { type: SchemaTypes.String, default: auctionDefaultParcelParameters.width },
        length: { type: SchemaTypes.String, default: auctionDefaultParcelParameters.length },
        height: { type: SchemaTypes.String, default: auctionDefaultParcelParameters.height },
        weight: { type: SchemaTypes.String, default: auctionDefaultParcelParameters.weight },
        units: { type: SchemaTypes.String, default: auctionDefaultParcelParameters.units },
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
