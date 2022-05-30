import dayjs, { Dayjs } from 'dayjs';
import { Connection, Document, Model, ObjectId, Schema, SchemaTypes } from 'mongoose';

import { InfluencerCollectionName, IInfluencer } from '../../Influencer/mongodb/InfluencerModel';
import { IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';
import { NotificationStatus } from '../dto/NotificationStatus';

export interface INotification extends Document {
  createdBy: IUserAccount['_id'];
  recipients: IInfluencer['_id'][];
  status: AuctionStatus;
  message: string;
  sendAt: Dayjs;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export const NotificationCollectionName = 'notifications';

const NotificationSchema: Schema<INotification> = new Schema<INotification>({
  createdBy: { type: SchemaTypes.String, required: true },
  recipients: { type: [SchemaTypes.ObjectId], ref: InfluencerCollectionName, required: true },
  status: { type: SchemaTypes.String, required: true, index: true },
  message: { type: SchemaTypes.String, required: true },
  sendAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
  createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
  updatedAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
});

export const NotificationModel = (connection: Connection): Model<INotification> =>
  connection.model<INotification>(NotificationCollectionName, NotificationSchema);
