import { DineroObject } from 'dinero.js';

import { Assistant } from './Assistant';
import { Auction } from './Auction';
import { Charity } from './Charity';
import { Follow } from './Follow';

export interface InfluencerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  sport: string;
  profileDescription?: string;
  favoriteCharities: Charity[];
  assistants: Assistant[];
  auctions?: Auction[];
  status?: InfluencerStatus;
  totalRaisedAmount: DineroObject;
  followers?: Follow[];
}

export enum InfluencerStatus {
  TRANSIENT = 'TRANSIENT',
  INVITATION_PENDING = 'INVITATION_PENDING',
  ONBOARDED = 'ONBOARDED',
}
