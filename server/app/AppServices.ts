import { Auth0Service } from '../authz';
import { AssistantService } from './Assistant';
import { UserAccountService } from './UserAccount';
import { InfluencerService } from './Influencer';
import { InvitationService } from './Invitation';
import { CharityService } from './Charity';
import { AuctionService } from './Auction';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';
import { UrlShortenerService } from './Core';
import { PaymentService } from './Payment';
import { TermsService } from './Terms';

export interface IAppServices {
  assistant: AssistantService;
  auction: AuctionService;
  auth0: Auth0Service;
  charity: CharityService;
  influencer: InfluencerService;
  invitation: InvitationService;
  payment: PaymentService;
  terms: TermsService;
  twilioNotification: TwilioNotificationService;
  twilioVerification: TwilioVerificationService;
  urlShortener: UrlShortenerService;
  userAccount: UserAccountService;
}
