import dayjs, { Dayjs } from 'dayjs';
import { Connection, Document, Model, ObjectId, Schema, SchemaTypes } from 'mongoose';
import { InvitationParentEntityType } from './InvitationParentEntityType';
import { ShortLinkCollectionName, IShortLinkModel } from '../../ShortLink/mongodb/ShortLinkModel';

export interface IInvitation extends Document {
  firstName: string;
  lastName: string;
  welcomeMessage: string;
  slug: string;
  accepted: boolean;
  phoneNumber: string;
  parentEntityType: InvitationParentEntityType;
  parentEntityId: ObjectId;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  shortLink: IShortLinkModel['_id'];
}

export const InvitationCollectionName = 'invitation';

const InvitationSchema: Schema<IInvitation> = new Schema<IInvitation>({
  firstName: { type: SchemaTypes.String, required: true },
  lastName: { type: SchemaTypes.String },
  welcomeMessage: { type: SchemaTypes.String },
  slug: { type: SchemaTypes.String, required: true, index: true, unique: true },
  accepted: { type: SchemaTypes.Boolean, required: true, default: false },
  phoneNumber: { type: SchemaTypes.String, required: true },
  parentEntityType: { type: SchemaTypes.String, index: true, required: true },
  parentEntityId: { type: SchemaTypes.ObjectId, index: true },
  createdAt: {
    type: SchemaTypes.Date,
    default: dayjs().second(0),
    get: (v) => dayjs(v),
  },
  updatedAt: {
    type: SchemaTypes.Date,
    default: dayjs().second(0),
    get: (v) => dayjs(v),
  },
  shortLink: { type: SchemaTypes.ObjectId, ref: ShortLinkCollectionName },
});

export const InvitationModel = (connection: Connection): Model<IInvitation> => {
  return connection.model<IInvitation>(InvitationCollectionName, InvitationSchema);
};
