import { Assistant } from './Assistant';
import { InfluencerProfile } from './InfluencerProfile';
import { PaymentInformation } from './PaymentInformation';
import { TermsInput } from 'src/types/TermsInput';

export interface UserProfile {
  isAdmin?: boolean;
  influencerProfile: InfluencerProfile | null;
  assistant: Assistant | null;
  paymentInformation: PaymentInformation | null;
  createdAt: Date;
  notAcceptedTerms: TermsInput | null;
}
