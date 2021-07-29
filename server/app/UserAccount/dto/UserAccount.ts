import { UserAccountStatus } from './UserAccountStatus';
import { UserAccountAddress } from './UserAccountAddress';

export interface UserAccount {
  id: string;
  phoneNumber?: string;
  status: UserAccountStatus;
  mongodbId?: string;
  isAdmin?: boolean;
  stripeCustomerId?: string;
  createdAt: string;
  notAcceptedTerms?: string;
  address?: UserAccountAddress;
}
