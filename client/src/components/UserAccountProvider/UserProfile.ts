import { Assistant } from './Assistant';
import { InfluencerProfile } from './InfluencerProfile';
import { PaymentInformation } from './PaymentInformation';

export interface UserProfile {
  isAdmin?: boolean;
  influencerProfile: InfluencerProfile | null;
  assistant: Assistant | null;
  paymentInformation: PaymentInformation | null;
  createdAt: Date;
  notAcceptedTerms: string | null;
}
