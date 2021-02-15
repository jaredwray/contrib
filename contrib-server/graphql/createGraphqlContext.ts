import Express from 'express';
import { ExpressContext } from 'apollo-server-express';

import { GraphqlContext } from './GraphqlContext';
import { initMongodbConnection } from '../mongodb';
import { Auth0Service, Auth0User } from '../authz';
import { UserAccountService } from '../app/UserAccount';
import { TwilioVerificationService } from '../twilio-client';

export async function createGraphqlContext(ctx: ExpressContext): Promise<GraphqlContext> {
  const auth0 = new Auth0Service();
  const twilioVerification = new TwilioVerificationService();
  const [connection, user] = await Promise.all([initMongodbConnection(), fetchAuth0User(auth0, ctx.req)]);

  const userAccount = new UserAccountService(connection, auth0, twilioVerification);

  return { user, auth0, userAccount, twilioVerification };
}

async function fetchAuth0User(auth0: Auth0Service, req: Express.Request): Promise<Auth0User | null> {
  const authorization = req.header('Authorization') ?? '';
  if (authorization.startsWith('Bearer ')) {
    const token = authorization.split(' ').slice(1).join(' ');
    return auth0.getUserFromBearerToken(token);
  }
  return null;
}
