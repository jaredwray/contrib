import { Connection } from 'mongoose';
import { getConnection } from '../database/Provider';
import { ExpressContext } from 'apollo-server-express';
import { fetchAuthUser } from './Auth';
import { AuthUser } from '../dto/AuthUser';

/**
 * @description holds context for Apollo Server
 */

export interface IAppGqlContext {
  dbConn: Connection;
  authUser: AuthUser;
}

export const context = async (ctx: ExpressContext): Promise<IAppGqlContext> => {
  const dbConn = await getConnection();
  const authUser = await fetchAuthUser(ctx.req);
  return { dbConn, authUser };
};
