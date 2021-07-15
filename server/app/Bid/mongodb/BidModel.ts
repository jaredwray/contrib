import dayjs from 'dayjs';
import { AppConfig } from '../../../config';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';
import { IAuctionModel, AuctionCollectionName } from '../../Auction/mongodb/AuctionModel';

export interface IBidModel extends Document {
  auction: IAuctionModel['_id'];
  user: IUserAccount['_id'];
  createdAt: dayjs.Dayjs;
  paymentSource: string;
  bid: number;
  bidCurrency: Dinero.Currency;
  chargeId: string;
}

export const BidCollectionName = 'bids';

const BidSchema: Schema<IBidModel> = new Schema<IBidModel>({
  auction: { type: SchemaTypes.ObjectId, ref: AuctionCollectionName },
  user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  bid: { type: SchemaTypes.Number, required: true },
  bidCurrency: { type: SchemaTypes.String, default: AppConfig.app.defaultCurrency },
  paymentSource: { type: SchemaTypes.String, required: true },
  createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
  chargeId: { type: SchemaTypes.String },
});

export const BidModel = (connection: Connection): Model<IBidModel> =>
  connection.model<IBidModel>(BidCollectionName, BidSchema);
