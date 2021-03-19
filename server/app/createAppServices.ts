import { Connection } from 'mongoose';
import { IAppServices } from './AppServices';

import { EventHub } from './EventHub';
import { Auth0Service } from '../authz';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';
import { StripeService } from '../payment/StripeService';
import { UserAccountService } from './UserAccount';
import { InfluencerService } from './Influencer/service/InfluencerService';
import { InvitationService } from './Influencer/service/InvitationService';
import { CharityService } from './Charity/service/CharityService';
import { AuctionService } from './Auction/service/AuctionService';
import { GCloudStorage } from './GCloudStorage';
import { CloudflareStreaming } from './CloudflareStreaming';
import { createAppRepositories } from './createAppRepositories';

export default function createAppServices(connection: Connection): IAppServices {
  const eventHub = new EventHub();
  const auth0 = new Auth0Service();
  const twilioVerification = new TwilioVerificationService();
  const twilioNotification = new TwilioNotificationService();
  const stripeService = new StripeService();

  const charity = new CharityService(connection);
  const userAccount = new UserAccountService(connection, twilioVerification, eventHub);
  const influencer = new InfluencerService(connection, charity);
  const invitation = new InvitationService(connection, userAccount, influencer, twilioNotification, eventHub);

  const cloudflareStreaming = new CloudflareStreaming();
  const cloudStorage = new GCloudStorage(cloudflareStreaming);

  const auction = new AuctionService(connection, stripeService, cloudStorage);

  return {
    auth0,
    userAccount,
    twilioVerification,
    twilioNotification,
    influencer,
    invitation,
    charity,
    auction,
  };
}
