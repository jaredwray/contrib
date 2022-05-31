import { AssistantService } from './Assistant';
import { UserAccountService } from './UserAccount';
import { InfluencerService } from './Influencer';
import { InvitationService } from './Invitation';
import { CharityService } from './Charity';
import { AuctionService } from './Auction';
import { ShortLinkService } from './ShortLink';
import { BidService } from './Bid';
import { PhoneNumberVerificationService } from './PhoneNumberVerificationService';

import { NotificationService } from './NotificationService';
import { PaymentService, StripeService } from './Payment';
import { CloudTaskService } from './CloudTaskService';

export interface IAppServices {
  assistant: AssistantService;
  userAccount: UserAccountService;
  bidService: BidService;
  influencerService: InfluencerService;
  invitation: InvitationService;
  charity: CharityService;
  auctionService: AuctionService;
  phoneNumberVerificationService: PhoneNumberVerificationService;
  notificationService: NotificationService;
  payment: PaymentService;
  stripeService: StripeService;
  cloudTaskService: CloudTaskService;
  shortLinkService: ShortLinkService;
}
