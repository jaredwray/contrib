import { Assistant } from './Assistant';
import { Charity } from './Charity';
import { InfluencerProfile } from './InfluencerProfile';
import { PaymentInformation } from './PaymentInformation';

export interface UserProfile {
  isAdmin?: boolean;
  influencerProfile: InfluencerProfile | null;
  charity: Charity | null;
  assistant: Assistant | null;
  paymentInformation: PaymentInformation | null;
  createdAt: Date;
  notAcceptedTerms: string | null;
}
