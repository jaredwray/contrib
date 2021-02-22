import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';
import * as dayjs from 'dayjs';
import * as Dinero from 'dinero.js';

export interface IAuctionBidModel extends Document {
  user: IUserAccount['_id'];
  bidMoney?: Dinero.Dinero;
  createdAt: dayjs.Dayjs;
  bid: number;
  bidCurrency: Dinero.Currency;
}

export const AuctionBidCollectionName = 'bids';

const AuctionBidSchema: Schema<IAuctionBidModel> = new Schema<IAuctionBidModel>({
  user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  bid: { type: SchemaTypes.Number, required: true },
  bidCurrency: { type: SchemaTypes.String, default: 'USD' },
  createdAt: { type: SchemaTypes.Date, default: dayjs().local().toDate(), get: (v) => dayjs(v) },
});

AuctionBidSchema.virtual('bidMoney').get(function () {
  return Dinero({ amount: this.bid, currency: this.bidCurrency });
});

export const AuctionBidModel = (connection: Connection): Model<IAuctionBidModel> =>
  connection.model<IAuctionBidModel>(AuctionBidCollectionName, AuctionBidSchema);
