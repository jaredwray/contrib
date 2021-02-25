import { Connection } from 'mongoose';
import { IAppServices } from './AppServices';

import { EventHub } from './EventHub';
import { Auth0Service } from '../authz';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';
import { StripeService } from '../payment/StripeService';
import { UserAccountService } from './UserAccount';
import { UserAccountLoader } from './UserAccount/service/UserAccountLoader';
import { InfluencerService } from './Influencer/service/InfluencerService';
import { InfluencerLoader } from './Influencer/service/InfluencerLoader';
import { InvitationService } from './Influencer/service/InvitationService';
import { InvitationLoader } from './Influencer/service/InvitationLoader';
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
  const userAccountLoader = new UserAccountLoader(userAccount);
  const influencer = new InfluencerService(connection);
  const influencerLoader = new InfluencerLoader(influencer);
  const invitation = new InvitationService(connection, userAccount, influencer, twilioNotification, eventHub);
  const invitationLoader = new InvitationLoader(invitation);
  const cloudStorage = new GCloudStorage();

  const charity = new CharityService(connection);
  const auction = new AuctionService(connection, stripeService, cloudStorage);

  const userAccountRolesManagement = new UserAccountRolesManagementService(auth0, eventHub);

  return {
    auth0,
    userAccount,
    userAccountLoader,
    twilioVerification,
    twilioNotification,
    influencer,
    influencerLoader,
    invitation,
    invitationLoader,
    charity,
    auction,
    userAccountRolesManagement,
  };
}
