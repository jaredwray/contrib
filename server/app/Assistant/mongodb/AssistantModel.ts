import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { AssistantStatus } from '../dto/AssistantStatus';
import { IUserAccount, UserAccountCollectionName } from '../../UserAccount/mongodb/UserAccountModel';
import { IInfluencer, InfluencerCollectionName } from '../../Influencer/mongodb/InfluencerModel';

export interface IAssistant extends Document {
  name: string;
  status: AssistantStatus;
  userAccount: IUserAccount['_id'];
  influencer: IInfluencer['_id'];
}

export const AssistantCollectionName = 'assistants';

const AssistantSchema: Schema<IAssistant> = new Schema<IAssistant>({
  name: { type: SchemaTypes.String, required: true },
  status: { type: SchemaTypes.String, required: true },
  userAccount: { type: SchemaTypes.ObjectId, ref: UserAccountCollectionName },
  influencer: { type: SchemaTypes.ObjectId, ref: InfluencerCollectionName, required: true },
});

export const AssistantModel = (connection: Connection): Model<IAssistant> => {
  return connection.model<IAssistant>(AssistantCollectionName, AssistantSchema);
};
