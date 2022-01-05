import { Dayjs } from 'dayjs';
import { UserAccountStatus } from './UserAccountStatus';
import { UserAccountAddress } from './UserAccountAddress';

export interface UserAccount {
  id: string;
  phoneNumber?: string;
  status: UserAccountStatus;
  mongodbId?: string;
  isAdmin?: boolean;
  stripeCustomerId?: string;
  createdAt: Dayjs;
  updatedAt?: Dayjs;
  notAcceptedTerms?: string;
  address?: UserAccountAddress;
}
