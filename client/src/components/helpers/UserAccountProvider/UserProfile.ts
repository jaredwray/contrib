import { Assistant } from './Assistant';
import { Charity } from './Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';
import { PaymentInformation } from './PaymentInformation';
import { UserAccountAddress } from './UserAccountAddress';

export interface UserProfile {
  mongodbId: string;
  isAdmin?: boolean;
  influencerProfile: InfluencerProfile | null;
  charity: Charity | null;
  assistant: Assistant | null;
  paymentInformation: PaymentInformation | null;
  createdAt: Date;
  notAcceptedTerms: string | null;
  address: UserAccountAddress;
  phoneNumber: string;
}
