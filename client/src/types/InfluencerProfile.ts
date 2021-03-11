import { Charity } from './Charity';

export interface InfluencerProfile {
  name: string;
  avatarUrl: string;
  sport: string | null;
  team: string | null;
  profileDescription: string | null;
  favoriteCharities: Charity[];
}
