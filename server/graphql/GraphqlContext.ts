import { Auth0User } from '../authz';
import { IAppServices } from '../app/AppServices';

export interface GraphqlContext extends IAppServices {
  user: Auth0User;
}
