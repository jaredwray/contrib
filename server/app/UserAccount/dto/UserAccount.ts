import { UserAccountStatus } from './UserAccountStatus';
import { TermsInput } from '../../Terms/dto/TermsInput';

export interface UserAccount {
  id: string;
  phoneNumber?: string;
  status: UserAccountStatus;
  mongodbId?: string;
  isAdmin?: boolean;
  stripeCustomerId?: string;
  createdAt: string;
  notAcceptedTerms?: TermsInput;
}
