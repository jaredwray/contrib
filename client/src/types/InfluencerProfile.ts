import { Charity } from './Charity';

export interface InfluencerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  sport: string | null;
  team: string | null;
  profileDescription: string | null;
  favoriteCharities: Charity[];
}
