import { Auth0User, Auth0Service } from '../auth0';
import { UserAccountService } from '../app/UserAccount';
import { TwilioVerificationService } from '../twilio/TwilioVerificationService';

export interface GraphqlContext {
  user: Auth0User;
  auth0: Auth0Service;
  userAccount: UserAccountService;
  twilioVerification: TwilioVerificationService;
}
