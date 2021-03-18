import { Auth0User } from '../authz';
import { IAppServices } from '../app/AppServices';
import { IAppLoaders } from '../app/AppLoaders';
import { InfluencerProfile } from '../app/Influencer/dto/InfluencerProfile';
import { UserAccount } from '../app/UserAccount/dto/UserAccount';

export interface GraphqlContext extends IAppServices {
  user: Auth0User;
  loaders: IAppLoaders;
  currentAccount?: UserAccount;
  currentInfluencer?: InfluencerProfile;
}
