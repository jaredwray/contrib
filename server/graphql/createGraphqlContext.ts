import { ExpressContext } from 'apollo-server-express';

import { GraphqlContext } from './GraphqlContext';
import { IAppServices } from '../app/AppServices';
import { IAppLoaders } from '../app/AppLoaders';
import { createAppLoaders } from '../app/createAppLoaders';
import { AuthUser } from '../auth/dto/AuthUser';

export async function createGraphqlContext(ctx: ExpressContext, appServices: IAppServices): Promise<GraphqlContext> {
  const user = (ctx.req?.user || { id: '' }) as AuthUser;
  const loaders: IAppLoaders = createAppLoaders(appServices);
  return { ...appServices, loaders, user };
}
