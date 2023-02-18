export enum InfluencerStatus {
  /**
   * Influencer has been created, but invite has never been sent to him.
   * This profile is supposed to be managed by system admin.
   */
  TRANSIENT = 'TRANSIENT',

  /**
   * Invite has been sent, but never accepted.
   */
  INVITATION_PENDING = 'INVITATION_PENDING',

  /**
   * Fully onboarded influencer.
   */
  ONBOARDED = 'ONBOARDED',
}
