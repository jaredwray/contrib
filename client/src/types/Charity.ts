export enum CharityStatus {
  PENDING_INVITE = 'PENDING_INVITE',
  PENDING_ONBOARDING = 'PENDING_ONBOARDING',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Charity {
  id: string;
  name: string;
  status: CharityStatus;
  avatarUrl?: string;
  websiteUrl?: string;
  profileDescription?: string;
  stripeAccountLink: string;
}
