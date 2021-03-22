import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';
import dayjs from 'dayjs';
import Dinero from 'dinero.js';

export interface IAuctionBidModel extends Document {
  user: IUserAccount['_id'];
  bidMoney?: Dinero.Dinero;
  createdAt: dayjs.Dayjs;
  paymentSource: string;
  bid: number;
  bidCurrency: Dinero.Currency;
  chargeId: string;
}

export const AuctionBidCollectionName = 'bids';

const AuctionBidSchema: Schema<IAuctionBidModel> = new Schema<IAuctionBidModel>({
  user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  bid: { type: SchemaTypes.Number, required: true },
  bidCurrency: { type: SchemaTypes.String, default: 'USD' },
  paymentSource: { type: SchemaTypes.String, required: true },
  createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
  chargeId: { type: SchemaTypes.String },
});

AuctionBidSchema.virtual('bidMoney').get(function () {
  return Dinero({ amount: this.bid, currency: this.bidCurrency });
});

export const AuctionBidModel = (connection: Connection): Model<IAuctionBidModel> =>
  connection.model<IAuctionBidModel>(AuctionBidCollectionName, AuctionBidSchema);
