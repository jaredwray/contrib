import { IAppServices } from './AppServices';
import { IAppLoaders } from './AppLoaders';
import { UserAccountLoader } from './UserAccount/service/UserAccountLoader';
import { InvitationLoader } from './Influencer/service/InvitationLoader';
import { InfluencerLoader } from './Influencer/service/InfluencerLoader';

export function createAppLoaders(services: IAppServices): IAppLoaders {
  return {
    userAccount: new UserAccountLoader(services.userAccount),
    invitation: new InvitationLoader(services.invitation),
    influencer: new InfluencerLoader(services.influencer),
  };
}
