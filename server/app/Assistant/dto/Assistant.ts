import { AssistantInfluencer } from './AssistantInfluencer';

export enum AssistantStatus {
  INVITATION_PENDING = 'INVITATION_PENDING',
  ONBOARDED = 'ONBOARDED',
}

export interface Assistant {
  id: string;
  name: string;
  status: AssistantStatus;
  userAccount: string;
  influencerId: string;
  influencerIds: string[];
}
