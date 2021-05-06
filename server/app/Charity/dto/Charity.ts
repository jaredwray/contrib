import { CharityStatus } from './CharityStatus';
export interface Charity {
  id: string;
  name: string;
  status: CharityStatus;
  userAccount: string;
  stripeAccountId: string | null;
  stripeAccountLink?: string | null;
  avatarUrl: string | null;
  profileDescription: string | null;
  websiteUrl: string | null;
}
