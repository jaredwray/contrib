import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';

export interface IAuctionBidModel extends Document {
  user: IUserAccount['_id'];
  bid: string;
}

export const AuctionBidCollectionName = 'bids';

const AuctionBidSchema: Schema<IAuctionBidModel> = new Schema<IAuctionBidModel>({
  user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  bid: { type: SchemaTypes.String, required: true },
});

export const AuctionBidModel = (connection: Connection): Model<IAuctionBidModel> =>
  connection.model<IAuctionBidModel>(AuctionBidCollectionName, AuctionBidSchema);
