import { Auth0Service } from '../authz';
import { UserAccountService } from './UserAccount';
import { UserAccountLoader } from './UserAccount/service/UserAccountLoader';
import { InfluencerService } from './Influencer/service/InfluencerService';
import { InfluencerLoader } from './Influencer/service/InfluencerLoader';
import { InvitationService } from './Influencer/service/InvitationService';
import { InvitationLoader } from './Influencer/service/InvitationLoader';
import { CharityService } from './Charity/service/CharityService';
import { AuctionService } from './Auction/service/AuctionService';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';
import { UserAccountRolesManagementService } from './UserAccount/service/UserAccountRolesManagementService';

export interface IAppServices {
  auth0: Auth0Service;
  userAccount: UserAccountService;
  userAccountLoader: UserAccountLoader;
  influencer: InfluencerService;
  influencerLoader: InfluencerLoader;
  invitation: InvitationService;
  invitationLoader: InvitationLoader;
  charity: CharityService;
  auction: AuctionService;
  twilioVerification: TwilioVerificationService;
  twilioNotification: TwilioNotificationService;
  userAccountRolesManagement: UserAccountRolesManagementService;
}
