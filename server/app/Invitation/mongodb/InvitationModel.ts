import { Connection, Document, Model, ObjectId, Schema, SchemaTypes } from 'mongoose';
import { InvitationParentEntityType } from './InvitationParentEntityType';

export interface IInvitation extends Document {
  firstName: string;
  lastName: string;
  welcomeMessage: string;
  slug: string;
  accepted: boolean;
  phoneNumber: string;
  parentEntityType: InvitationParentEntityType;
  parentEntityId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const InvitationCollectionName = 'invitation';

const InvitationSchema: Schema<IInvitation> = new Schema<IInvitation>({
  firstName: { type: SchemaTypes.String, required: true },
  lastName: { type: SchemaTypes.String, required: true },
  welcomeMessage: { type: SchemaTypes.String, required: true },
  slug: { type: SchemaTypes.String, required: true, unique: true },
  accepted: { type: SchemaTypes.Boolean, required: true },
  phoneNumber: { type: SchemaTypes.String, required: true },
  parentEntityType: { type: SchemaTypes.String, required: true },
  parentEntityId: { type: SchemaTypes.ObjectId, required: true },
  createdAt: { type: SchemaTypes.Date, required: true },
  updatedAt: { type: SchemaTypes.Date, required: true },
});

InvitationSchema.index({ parentEntityType: 1, parentEntityId: 1 }, { unique: true });

export const InvitationModel = (connection: Connection): Model<IInvitation> => {
  return connection.model<IInvitation>(InvitationCollectionName, InvitationSchema);
};
