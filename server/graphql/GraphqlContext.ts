import { Auth0Service, Auth0User } from '../authz';
import { UserAccountService } from '../app/UserAccount';
import { TwilioVerificationService, TwilioNotificationService } from '../twilio-client';
import { InfluencerService } from '../app/Influencer/service/InfluencerService';
import { InvitationService } from '../app/Influencer/service/InvitationService';
import { UserAccountLoader } from '../app/UserAccount/service/UserAccountLoader';
import { InvitationLoader } from '../app/Influencer/service/InvitationLoader';
import { InfluencerLoader } from '../app/Influencer/service/InfluencerLoader';
import { UserAccountRolesManagementService } from '../app/UserAccount/service/UserAccountRolesManagementService';
import { CharityService } from '../app/Charity/service/CharityService';

export interface GraphqlContext {
  user: Auth0User;
  auth0: Auth0Service;
  userAccount: UserAccountService;
  userAccountLoader: UserAccountLoader;
  influencer: InfluencerService;
  influencerLoader: InfluencerLoader;
  invitation: InvitationService;
  invitationLoader: InvitationLoader;
  charity: CharityService;
  twilioVerification: TwilioVerificationService;
  twilioNotification: TwilioNotificationService;
  userAccountRolesManagement: UserAccountRolesManagementService;
}
