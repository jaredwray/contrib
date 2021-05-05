import { CharityStatus } from './CharityStatus';

export interface Charity {
  id: string;
  name: string;
  status: CharityStatus;
  userAccount: string;
  stripeAccountId: string;
  stripeAccountLink?: string;
}
