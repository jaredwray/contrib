import Express from 'express';
import { ExpressContext } from 'apollo-server-express';
import { EventEmitter } from 'events';

import { GraphqlContext } from './GraphqlContext';
import { initMongodbConnection } from '../mongodb';
import { Auth0Service, Auth0User } from '../authz';
import { UserAccountService } from '../app/UserAccount';
import { TwilioNotificationService, TwilioVerificationService } from '../twilio-client';
import { InfluencerService } from '../app/Influencer/service/InfluencerService';
import { InvitationService } from '../app/Influencer/service/InvitationService';
import { UserAccountLoader } from '../app/UserAccount/service/UserAccountLoader';
import { InvitationLoader } from '../app/Influencer/service/InvitationLoader';
import { InfluencerLoader } from '../app/Influencer/service/InfluencerLoader';
import { UserAccountRolesManagementService } from '../app/UserAccount/service/UserAccountRolesManagementService';
import { CharityService } from '../app/Charity/service/CharityService';
import { AuctionService } from '../app/Auction/service/AuctionService';

export async function createGraphqlContext(ctx: ExpressContext): Promise<GraphqlContext> {
  const eventHub = new EventEmitter();
  const auth0 = new Auth0Service();
  const twilioVerification = new TwilioVerificationService();
  const twilioNotification = new TwilioNotificationService();
  const [connection, user] = await Promise.all([initMongodbConnection(), fetchAuth0User(auth0, ctx.req)]);

  const userAccount = new UserAccountService(connection, twilioVerification, eventHub);
  const userAccountLoader = new UserAccountLoader(userAccount);
  const influencer = new InfluencerService(connection);
  const influencerLoader = new InfluencerLoader(influencer);
  const invitation = new InvitationService(connection, userAccount, influencer, twilioNotification, eventHub);
  const invitationLoader = new InvitationLoader(invitation);
  const charity = new CharityService(connection);
  const auction = new AuctionService(connection);

  const userAccountRolesManagement = new UserAccountRolesManagementService(auth0, eventHub);

  return {
    user,
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

async function fetchAuth0User(auth0: Auth0Service, req: Express.Request): Promise<Auth0User | null> {
  const authorization = req.header('Authorization') ?? '';
  if (authorization.startsWith('Bearer ')) {
    const token = authorization.split(' ').slice(1).join(' ');
    return auth0.getUserFromBearerToken(token);
  }
  return null;
}
