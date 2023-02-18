import { AssistantLoader } from './Assistant/service/AssistantLoader';
import { UserAccountLoader } from './UserAccount/service/UserAccountLoader';
import { InfluencerLoader } from './Influencer/service/InfluencerLoader';
import { InvitationLoader } from './Invitation/service/InvitationLoader';
import { CharityLoader } from './Charity/service/CharityLoader';

export interface IAppLoaders {
  assistant: AssistantLoader;
  userAccount: UserAccountLoader;
  influencer: InfluencerLoader;
  invitation: InvitationLoader;
  charity: CharityLoader;
}
