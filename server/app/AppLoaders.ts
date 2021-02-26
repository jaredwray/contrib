import { UserAccountLoader } from './UserAccount/service/UserAccountLoader';
import { InfluencerLoader } from './Influencer/service/InfluencerLoader';
import { InvitationLoader } from './Influencer/service/InvitationLoader';

export interface IAppLoaders {
  userAccount: UserAccountLoader;
  influencer: InfluencerLoader;
  invitation: InvitationLoader;
}
