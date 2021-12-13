import { IAppServices } from '../app/AppServices';
import { IAppLoaders } from '../app/AppLoaders';
import { InfluencerProfile } from '../app/Influencer/dto/InfluencerProfile';
import { Assistant } from '../app/Assistant/dto/Assistant';
import { UserAccount } from '../app/UserAccount/dto/UserAccount';
import { Charity } from '../app/Charity/dto/Charity';
import { AuthUser } from '../auth/dto/AuthUser';

export interface GraphqlContext extends IAppServices {
  user: AuthUser;
  loaders: IAppLoaders;
  currentAccount?: UserAccount;
  currentInfluencer?: InfluencerProfile;
  currentCharityId?: string;
  currentCharity?: Charity;
  currentAssistant?: Assistant;
  currentInfluencerId?: string;
}
