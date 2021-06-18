import dayjs from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { InfluencerStatus } from '../dto/InfluencerStatus';
import { IUserAccount, UserAccountCollectionName, IFollowObject } from '../../UserAccount/mongodb/UserAccountModel';
import { AssistantCollectionName, IAssistant } from '../../Assistant/mongodb/AssistantModel';
import { CharityCollectionName, ICharityModel } from '../../Charity/mongodb/CharityModel';

export interface IInfluencer extends Document {
  name: string;
  avatarUrl: string;
  status: InfluencerStatus;
  userAccount: IUserAccount['_id'];
  sport: string | null;
  team: string | null;
  profileDescription: string | null;
  favoriteCharities: ICharityModel['_id'][];
  assistants: IAssistant['_id'][];
  followers: IFollowObject[];
}

export const InfluencerCollectionName = 'influencer';

const InfluencerSchema: Schema<IInfluencer> = new Schema<IInfluencer>({
  name: { type: SchemaTypes.String, required: true },
  avatarUrl: { type: SchemaTypes.String, required: true },
  status: { type: SchemaTypes.String, required: true },
  userAccount: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  sport: { type: SchemaTypes.String },
  team: { type: SchemaTypes.String },
  profileDescription: { type: SchemaTypes.String },
  favoriteCharities: [{ type: SchemaTypes.ObjectId, ref: CharityCollectionName }],
  assistants: [{ type: SchemaTypes.ObjectId, ref: AssistantCollectionName }],
  followers: [
    {
      user: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
      createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
    },
  ],
});

export const InfluencerModel = (connection: Connection): Model<IInfluencer> => {
  return connection.model<IInfluencer>(InfluencerCollectionName, InfluencerSchema);
};
