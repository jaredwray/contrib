export enum StripeCharityStatus {
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
