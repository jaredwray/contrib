import { InfluencerStatus } from './InfluencerStatus';

export interface InfluencerProfile {
  id: string;
  name: string;
  sport: string | null;
  team: string | null;
  profileDescription: string | null;
  avatarUrl: string;
  status: InfluencerStatus;
  userAccount: string;
  favoriteCharities: string[];
}
