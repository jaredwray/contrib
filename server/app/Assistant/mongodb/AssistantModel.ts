import dayjs, { Dayjs } from 'dayjs';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { AssistantStatus } from '../dto/Assistant';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';
import { IInfluencer, InfluencerCollectionName } from '../../Influencer/mongodb/InfluencerModel';

export interface IAssistant extends Document {
  name: string;
  status: AssistantStatus;
  userAccount: IUserAccount['_id'];
  influencer?: IInfluencer['_id'];
  influencers: IInfluencer['_id'][];
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
  onboardedAt?: Dayjs;
}

export const AssistantCollectionName = 'assistants';

const AssistantSchema: Schema<IAssistant> = new Schema<IAssistant>({
  name: { type: SchemaTypes.String, required: true },
  status: { type: SchemaTypes.String, required: true },
  userAccount: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName, index: true },
  influencer: { type: SchemaTypes.ObjectId, ref: InfluencerCollectionName },
  influencers: { type: [SchemaTypes.ObjectId], ref: InfluencerCollectionName, required: true },
  createdAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
  updatedAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
  onboardedAt: { type: SchemaTypes.Date, get: (v) => dayjs(v) },
});

export const AssistantModel = (connection: Connection): Model<IAssistant> =>
  connection.model<IAssistant>(AssistantCollectionName, AssistantSchema);
