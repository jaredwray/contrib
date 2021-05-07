export enum CharityStripeStatus {
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
  STRIPE_ACTIVE = 'STRIPE_ACTIVE',

  /**
   * Stripe not accepted charity's account.
   */
  STRIPE_INACTIVE = 'STRIPE_INACTIVE',
}
