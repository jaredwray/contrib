export enum CharityStatus {
  /**
   * Invite has been sent, waiting until user sign in.
   */
  PENDING_INVITE = 'PENDING_INVITE',

  /**
   * Invite was accepted. Charity creates Stripe account.
   */
  PENDING_ONBOARDING = 'PENDING_ONBOARDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
