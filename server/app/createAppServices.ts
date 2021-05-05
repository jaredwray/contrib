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
import { AuctionService } from './Auction';
import { GCloudStorage } from './GCloudStorage';
import { CloudflareStreaming } from './CloudflareStreaming';
import { UrlShortenerService } from './Core';
import { PaymentService, StripeService } from './Payment';

export default function createAppServices(connection: Connection): IAppServices {
  const eventHub = new EventHub();
  const urlShortener = new UrlShortenerService();
  const auth0 = new Auth0Service();
  const twilioVerification = new TwilioVerificationService();
  const twilioNotification = new TwilioNotificationService();
  const stripe = new StripeService();

  const assistant = new AssistantService(connection);
  const charity = new CharityService(connection, eventHub);
  const userAccount = new UserAccountService(connection, twilioVerification, eventHub);
  const influencer = new InfluencerService(connection, charity);
  const payment = new PaymentService(userAccount, stripe, auth0);
  const invitation = new InvitationService(
    connection,
    assistant,
    userAccount,
    charity,
    influencer,
    twilioNotification,
    eventHub,
    urlShortener,
  );

  const cloudflareStreaming = new CloudflareStreaming();
  const cloudStorage = new GCloudStorage(cloudflareStreaming);

  const auction = new AuctionService(connection, payment, cloudStorage, urlShortener);

  return {
    assistant,
    auth0,
    urlShortener,
    userAccount,
    twilioVerification,
    twilioNotification,
    influencer,
    invitation,
    charity,
    auction,
    payment,
  };
}
