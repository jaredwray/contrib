import { Auth0Service } from '../authz';
import { UserAccountService } from './UserAccount';
import { InfluencerService, InvitationService } from './Influencer';
import { CharityService } from './Charity';
import { AuctionService } from './Auction';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';
import { UrlShortenerService } from './Core';

export interface IAppServices {
  auth0: Auth0Service;
  userAccount: UserAccountService;
  influencer: InfluencerService;
  invitation: InvitationService;
  charity: CharityService;
  auction: AuctionService;
  twilioVerification: TwilioVerificationService;
  twilioNotification: TwilioNotificationService;
  urlShortener: UrlShortenerService;
}
