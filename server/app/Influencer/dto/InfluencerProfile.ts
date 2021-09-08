import { InfluencerStatus } from './InfluencerStatus';
import { Follow } from '../../FollowDto';

export interface InfluencerProfile {
  id: string;
  name: string;
  sport: string;
  team: string | null;
  profileDescription: string | null;
  avatarUrl: string;
  status: InfluencerStatus;
  userAccount: string;
  favoriteCharities: string[];
  assistants: string[];
  followers: Follow[];
}
