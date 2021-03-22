import { InfluencerProfile } from './InfluencerProfile';
import { PaymentInformation } from './PaymentInformation';

export interface UserProfile {
  isAdmin?: boolean;
  influencerProfile: InfluencerProfile | null;
  paymentInformation: PaymentInformation | null;
}
