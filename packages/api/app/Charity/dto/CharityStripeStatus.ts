export enum CharityStripeStatus {
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
