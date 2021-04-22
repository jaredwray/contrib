import { AssistantStatus } from './AssistantStatus';

export interface Assistant {
  id: string;
  name: string;
  status: AssistantStatus;
  userAccount: string;
  influencerId: string;
}
