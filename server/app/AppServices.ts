import { Auth0Service } from '../authz';
import { AssistantService } from './Assistant';
import { UserAccountService } from './UserAccount';
import { InfluencerService } from './Influencer';
import { InvitationService } from './Invitation';
import { CharityService } from './Charity';
import { AuctionService } from './Auction';
import { ShortLinkService } from './ShortLink';
import { BidService } from './Bid';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';
import { PaymentService, StripeService } from './Payment';
import { CloudTaskService } from './CloudTaskService';
import { IHandlebarsService } from './Message/service/HandlebarsService';

export interface IAppServices {
  assistant: AssistantService;
  auth0: Auth0Service;
  userAccount: UserAccountService;
  bidService: BidService;
  influencer: InfluencerService;
  invitation: InvitationService;
  charity: CharityService;
  auction: AuctionService;
  twilioVerification: TwilioVerificationService;
  twilioNotification: TwilioNotificationService;
  payment: PaymentService;
  stripeService: StripeService;
  cloudTaskService: CloudTaskService;
  handlebarsService: IHandlebarsService;
  shortLinkService: ShortLinkService;
}
