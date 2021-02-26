import Express from 'express';
import { ExpressContext } from 'apollo-server-express';

import { IAppServices } from '../app/AppServices';
import { GraphqlContext } from './GraphqlContext';
import { Auth0Service, Auth0User } from '../authz';
import { IAppLoaders } from '../app/AppLoaders';
import { createAppLoaders } from '../app/createAppLoaders';

export async function createGraphqlContext(ctx: ExpressContext, appServices: IAppServices): Promise<GraphqlContext> {
  const user = await fetchAuth0User(appServices.auth0, ctx.req);
  const loaders: IAppLoaders = createAppLoaders(appServices);
  return { ...appServices, loaders, user };
}

async function fetchAuth0User(auth0: Auth0Service, req: Express.Request): Promise<Auth0User | null> {
  const authorization = req.header('Authorization') ?? '';
  if (authorization.startsWith('Bearer ')) {
    const token = authorization.split(' ').slice(1).join(' ');
    return auth0.getUserFromBearerToken(token);
  }
  return null;
}
