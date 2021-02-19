import { InfluencerProfile } from './InfluencerProfile';

export enum UserAccountStatus {
  PHONE_NUMBER_REQUIRED = 'PHONE_NUMBER_REQUIRED',
  PHONE_NUMBER_CONFIRMATION_REQUIRED = 'PHONE_NUMBER_CONFIRMATION_REQUIRED',
  COMPLETED = 'COMPLETED',
}

export interface InfluencerProfile {
  name: string;
  avatarUrl: string;
  sport: string | null;
  team: string | null;
  profileDescription: string | null;
}

export interface UserAccount {
  id: string;
  phoneNumber: string | null;
  status: UserAccountStatus;
  influencerProfile?: InfluencerProfile;
}
