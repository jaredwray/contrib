export enum CharityStatus {
  PENDING_INVITE = 'PENDING_INVITE',
  PENDING_ONBOARDING = 'PENDING_ONBOARDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export enum CharityProfileStatus {
  COMPLETED = 'COMPLETED',
  CREATED = 'CREATED',
}
export enum CharityStripeStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Charity {
  id: string;
  name: string;
  status: CharityStatus;
  profileStatus: CharityProfileStatus;
  stripeStatus: CharityStripeStatus;
  avatarUrl?: string;
  websiteUrl?: string;
  website?: string;
  profileDescription?: string;
  stripeAccountLink: string;
}
