import { CharityStatus } from './CharityStatus';
import { CharityProfileStatus } from './CharityProfileStatus';
export interface Charity {
  id: string;
  name: string;
  status: CharityStatus;
  userAccount: string;
  profileStatus: CharityProfileStatus;
  stripeAccountId: string | null;
  avatarUrl: string | null;
  profileDescription: string | null;
  websiteUrl: string | null;
}
