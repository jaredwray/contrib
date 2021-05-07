import { StripeCharityStatus } from './StripeCharityStatus';
import { CharityProfileStatus } from './CharityProfileStatus';
import { CharityStatus } from '../../../../client/src/types/Charity';

export interface Charity {
  id: string;
  name: string;
  stripeStatus: StripeCharityStatus;
  userAccount: string;
  status: CharityStatus;
  profileStatus: CharityProfileStatus;
  stripeAccountId: string | null;
  avatarUrl: string | null;
  profileDescription: string | null;
  websiteUrl: string | null;
}
