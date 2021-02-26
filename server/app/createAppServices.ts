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
import { UserAccountRolesManagementService } from './UserAccount/service/UserAccountRolesManagementService';
import { GCloudStorage } from './GCloudStorage';

export default function createAppServices(connection: Connection): IAppServices {
  const eventHub = new EventHub();
  const auth0 = new Auth0Service();
  const twilioVerification = new TwilioVerificationService();
  const twilioNotification = new TwilioNotificationService();
  const stripeService = new StripeService();

  const userAccount = new UserAccountService(connection, twilioVerification, eventHub);
  const influencer = new InfluencerService(connection);
  const invitation = new InvitationService(connection, userAccount, influencer, twilioNotification, eventHub);
  const cloudStorage = new GCloudStorage();

  const charity = new CharityService(connection);
  const auction = new AuctionService(connection, stripeService, cloudStorage);

  const userAccountRolesManagement = new UserAccountRolesManagementService(auth0, eventHub);

  return {
    auth0,
    userAccount,
    twilioVerification,
    twilioNotification,
    influencer,
    invitation,
    charity,
    auction,
    userAccountRolesManagement,
  };
}
