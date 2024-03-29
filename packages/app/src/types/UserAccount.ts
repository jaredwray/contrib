import { Address } from './Address';
import { Assistant } from './Assistant';
import { Charity } from './Charity';
import { InfluencerProfile } from './InfluencerProfile';

export enum UserAccountStatus {
  PHONE_NUMBER_REQUIRED = 'PHONE_NUMBER_REQUIRED',
  PHONE_NUMBER_CONFIRMATION_REQUIRED = 'PHONE_NUMBER_CONFIRMATION_REQUIRED',
  COMPLETED = 'COMPLETED',
}

export interface PaymentCard {
  cardBrand: string;
  cardExpirationMonth: number;
  cardNumberLast4: string;
  cardExpirationYear: number;
  id: string;
}

export interface UserAccount {
  id: string;
  isAdmin?: boolean;
  address: Address | null;
  mongodbId?: string;
  phoneNumber: string | null;
  status: UserAccountStatus;
  influencerProfile?: InfluencerProfile;
  assistant?: Assistant;
  charity?: Charity;
  paymentInformation: PaymentCard | null;
  createdAt: Date;
  notAcceptedTerms: string | null;
}
