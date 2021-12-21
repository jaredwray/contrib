import { Dayjs } from 'dayjs';
import Dinero from 'dinero.js';

import { CharityStatus } from './CharityStatus';
import { CharityProfileStatus } from './CharityProfileStatus';
import { CharityStripeStatus } from './CharityStripeStatus';
import { Follow } from '../../FollowDto';

export interface Charity {
  id: string;
  name: string;
  semanticId: string | null;
  status: CharityStatus;
  profileStatus: CharityProfileStatus;
  stripeStatus: CharityStripeStatus;
  userAccount: string;
  stripeAccountId: string | null;
  avatarUrl: string | null;
  profileDescription: string | null;
  website: string | null;
  websiteUrl: string | null;
  totalRaisedAmount: Dinero.Dinero;
  activatedAt: Dayjs;
  followers: Follow[];
}
