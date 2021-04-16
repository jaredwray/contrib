import { Assistant } from './Assistant';
import { Auction } from './Auction';
import { Charity } from './Charity';

export interface InfluencerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  sport: string | null;
  team: string | null;
  profileDescription: string | null;
  favoriteCharities: Charity[];
  assistants: Assistant[];
  auctions?: Auction[];
}

export enum InfluencerStatus {
  TRANSIENT = 'TRANSIENT',
  INVITATION_PENDING = 'INVITATION_PENDING',
  ONBOARDED = 'ONBOARDED',
}

export enum InfluencerStatus {
  TRANSIENT = 'TRANSIENT',
  INVITATION_PENDING = 'INVITATION_PENDING',
  ONBOARDED = 'ONBOARDED',
}
