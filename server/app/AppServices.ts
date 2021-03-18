import { Auth0Service } from '../authz';
import { UserAccountService } from './UserAccount';
import { InfluencerService } from './Influencer/service/InfluencerService';
import { InvitationService } from './Influencer/service/InvitationService';
import { CharityService } from './Charity/service/CharityService';
import { AuctionService } from './Auction/service/AuctionService';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';

export interface IAppServices {
  auth0: Auth0Service;
  userAccount: UserAccountService;
  influencer: InfluencerService;
  invitation: InvitationService;
  charity: CharityService;
  auction: AuctionService;
  twilioVerification: TwilioVerificationService;
  twilioNotification: TwilioNotificationService;
}
