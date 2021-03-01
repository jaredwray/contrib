import { UserAccountLoader } from './UserAccount/service/UserAccountLoader';
import { InfluencerLoader } from './Influencer/service/InfluencerLoader';
import { InvitationLoader } from './Influencer/service/InvitationLoader';
import { CharityLoader } from './Charity/service/CharityLoader';

export interface IAppLoaders {
  userAccount: UserAccountLoader;
  influencer: InfluencerLoader;
  invitation: InvitationLoader;
  charity: CharityLoader;
}
