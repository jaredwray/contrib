import { Connection } from 'mongoose';
import { IAppServices } from './AppServices';

import { EventHub } from './EventHub';
import { Auth0Service } from '../authz';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';
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
import { HandlebarsService } from './Message/service/HandlebarsService';

export default function createAppServices(connection: Connection): IAppServices {
  const eventHub = new EventHub();
  const auth0 = new Auth0Service();
  const twilioVerification = new TwilioVerificationService();
  const twilioNotification = new TwilioNotificationService();
  const cloudTaskService = new CloudTaskService();
  const stripeService = new StripeService();
  const shortLinkService = new ShortLinkService(connection);
  const assistant = new AssistantService(connection);
  const charity = new CharityService(connection, eventHub, stripeService);
  const ups = new UPSDeliveryService();
  const userAccount = new UserAccountService(connection, twilioVerification, eventHub, auth0);
  const influencer = new InfluencerService(connection, charity);
  const payment = new PaymentService(userAccount, stripeService, auth0);
  const handlebarsService = new HandlebarsService();
  const invitation = new InvitationService(
    connection,
    assistant,
    userAccount,
    charity,
    influencer,
    twilioNotification,
    eventHub,
    shortLinkService,
  );

  const cloudflareStreaming = new CloudflareStreaming();
  const cloudStorage = new GCloudStorage(cloudflareStreaming);
  const bidService = new BidService(connection);
  const auctionAttachments = new AuctionAttachmentsService(connection, cloudStorage);

  const auction = new AuctionService(
    connection,
    payment,
    cloudStorage,
    cloudTaskService,
    handlebarsService,
    bidService,
    stripeService,
    shortLinkService,
    auctionAttachments,
    ups,
  );

  return {
    assistant,
    auth0,
    userAccount,
    bidService,
    influencer,
    invitation,
    charity,
    auction,
    twilioVerification,
    twilioNotification,
    payment,
    stripeService,
    cloudTaskService,
    handlebarsService,
    shortLinkService,
  };
}
