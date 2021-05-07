import { CharityProfileStatus } from '../../../server/app/Charity/dto/CharityProfileStatus';
import { StripeCharityStatus } from '../../../server/app/Charity/dto/StripeCharityStatus';

export enum CharityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Charity {
  id: string;
  name: string;
  status: CharityStatus;
  charityProfileStatus: CharityProfileStatus;
  stripeCharityStatus: StripeCharityStatus;
  avatarUrl?: string;
  websiteUrl?: string;
  profileDescription?: string;
  stripeAccountLink: string;
}
