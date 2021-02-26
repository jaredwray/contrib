import { Auth0User } from '../authz';
import { IAppServices } from '../app/AppServices';
import { IAppLoaders } from '../app/AppLoaders';

export interface GraphqlContext extends IAppServices {
  user: Auth0User;
  loaders: IAppLoaders;
}
