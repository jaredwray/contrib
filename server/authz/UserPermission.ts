export enum UserPermission {
  /**
   * Admin permission, gives control over managing platform influencers.
   */
  MANAGE_INFLUENCERS = 'influencers:manage',

  /**
   * Permission granted to an onboarded influencer, capable of managing own profile.
   */
  INFLUENCER = 'influencer',
}
