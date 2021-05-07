export enum CharityStatus {
  /**
   * Invite has been sent, waiting until user sign in.
   */
  PENDING_INVITE = 'PENDING_INVITE',

  /**
   * Invite was accepted. Charity creates Stripe account.
   */
  PENDING_ONBOARDING = 'PENDING_ONBOARDING',

  /**
   * Stripe account has been created. Waiting for Stripe verification.
   */
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',

  /**
   * Fully onboarded charity. Stripe accepted charity's account.
   */
  ACTIVE = 'ACTIVE',

  /**
   * Stripe not accepted charity's account.
   */
  INACTIVE = 'INACTIVE',
}
