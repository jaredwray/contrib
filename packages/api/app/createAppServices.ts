import { Connection } from 'mongoose';
import { IAppServices } from './AppServices';

import { EventHub } from './EventHub';
import { PhoneNumberVerificationService } from './PhoneNumberVerificationService';
import { NotificationService } from './NotificationService';
import { UserAccountService } from './UserAccount';
import { InfluencerService } from './Influencer';
import { InvitationService } from './Invitation';
import { CharityService } from './Charity';
import { AssistantService } from './Assistant';
import { AuctionService, AuctionAttachmentsService } from './Auction';
import { BidService } from './Bid';
import { ShortLinkService } from './ShortLink';
import { UPSDeliveryService } from './UPSService';
import { GCloudStorage } from './GCloudStorage';
import { CloudflareStreaming } from './CloudflareStreaming';
import { PaymentService, StripeService } from './Payment';
import { CloudTaskService } from './CloudTaskService';

export default function createAppServices(connection: Connection): IAppServices {
  const eventHub = new EventHub();
  const phoneNumberVerificationService = new PhoneNumberVerificationService();
  const cloudTaskService = new CloudTaskService();
  const stripeService = new StripeService();
  const shortLinkService = new ShortLinkService(connection);
  const assistant = new AssistantService(connection);
  const charity = new CharityService(connection, eventHub, stripeService);
  const ups = new UPSDeliveryService();
  const notificationService = new NotificationService(cloudTaskService);
  const userAccount = new UserAccountService(
    connection,
    notificationService,
    phoneNumberVerificationService,
    eventHub,
    ups,
    stripeService,
  );
  const influencerService = new InfluencerService(connection, charity);
  const payment = new PaymentService(userAccount, stripeService);
  const invitation = new InvitationService(
    connection,
    assistant,
    userAccount,
    charity,
    influencerService,
    notificationService,
    eventHub,
    shortLinkService,
  );

  const cloudflareStreaming = new CloudflareStreaming();
  const cloudStorage = new GCloudStorage(cloudflareStreaming);
  const bidService = new BidService(connection);
  const auctionAttachments = new AuctionAttachmentsService(connection, cloudStorage);

  const auctionService = new AuctionService(
    connection,
    payment,
    cloudStorage,
    notificationService,
    bidService,
    stripeService,
    shortLinkService,
    auctionAttachments,
    ups,
  );

  return {
    assistant,
    userAccount,
    bidService,
    influencerService,
    invitation,
    charity,
    auctionService,
    phoneNumberVerificationService,
    notificationService,
    payment,
    stripeService,
    cloudTaskService,
    shortLinkService,
  };
}
