import { CharityStatus } from './CharityStatus';
import { CharityProfileStatus } from './CharityProfileStatus';
import { CharityStripeStatus } from './CharityStripeStatus';
import { Follow } from '../../FollowDto';

export interface Charity {
  id: string;
  name: string;
  status: CharityStatus;
  profileStatus: CharityProfileStatus;
  stripeStatus: CharityStripeStatus;
  userAccount: string;
  stripeAccountId: string | null;
  avatarUrl: string | null;
  profileDescription: string | null;
  website: string | null;
  websiteUrl: string | null;
  followers: Follow[];
}
