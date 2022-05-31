import { IAppServices } from './AppServices';
import { IAppLoaders } from './AppLoaders';
import { UserAccountLoader } from './UserAccount/service/UserAccountLoader';
import { InvitationLoader } from './Invitation/service/InvitationLoader';
import { InfluencerLoader } from './Influencer/service/InfluencerLoader';
import { CharityLoader } from './Charity/service/CharityLoader';
import { AssistantLoader } from './Assistant/service/AssistantLoader';

export function createAppLoaders(services: IAppServices): IAppLoaders {
  return {
    assistant: new AssistantLoader(services.assistant),
    userAccount: new UserAccountLoader(services.userAccount),
    invitation: new InvitationLoader(services.invitation),
    influencer: new InfluencerLoader(services.influencerService),
    charity: new CharityLoader(services.charity),
  };
}
