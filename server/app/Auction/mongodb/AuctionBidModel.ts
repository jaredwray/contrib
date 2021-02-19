import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';
import * as dayjs from 'dayjs';
import Dinero from 'dinero.js';

export interface IAuctionBidModel extends Document {
  user: IUserAccount['_id'];
  bidMoney: Dinero.Dinero;
}

export const AuctionBidCollectionName = 'bids';

const AuctionBidSchema: Schema<IAuctionBidModel> = new Schema<IAuctionBidModel>({
  user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  bid: { type: SchemaTypes.Number, required: true },
  bidCurrency: { type: SchemaTypes.String, default: 'USD' },
  createdAt: { type: SchemaTypes.Date, default: dayjs().local().toDate() },
});

AuctionBidSchema.virtual('bidMoney').get(function () {
  return Dinero({ amount: this.amount, currency: this.currency });
});

export const AuctionBidModel = (connection: Connection): Model<IAuctionBidModel> =>
  connection.model<IAuctionBidModel>(AuctionBidCollectionName, AuctionBidSchema);
