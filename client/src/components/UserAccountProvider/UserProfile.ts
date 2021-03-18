import { InfluencerProfile } from './InfluencerProfile';

export interface UserProfile {
  isAdmin?: boolean;
  influencerProfile: InfluencerProfile | null;
}
