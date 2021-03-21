import { Charity } from './Charity';
import { Auction } from './Auction';

export interface InfluencerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  sport: string | null;
  team: string | null;
  profileDescription: string | null;
  favoriteCharities: Charity[];
  auctions?: Auction[];
}
