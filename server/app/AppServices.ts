import { Auth0Service } from '../authz';
import { AssistantService } from './Assistant';
import { UserAccountService } from './UserAccount';
import { InfluencerService } from './Influencer';
import { InvitationService } from './Invitation';
import { CharityService } from './Charity';
import { AuctionService } from './Auction';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';
import { UrlShortenerService } from './Core';
import { PaymentService } from './Payment/service/PaymentService';

export interface IAppServices {
  assistant: AssistantService;
  auth0: Auth0Service;
  userAccount: UserAccountService;
  influencer: InfluencerService;
  invitation: InvitationService;
  charity: CharityService;
  auction: AuctionService;
  twilioVerification: TwilioVerificationService;
  twilioNotification: TwilioNotificationService;
  urlShortener: UrlShortenerService;
  payment: PaymentService;
}
