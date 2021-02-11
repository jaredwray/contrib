import { Connection } from 'mongoose';
import { getConnection } from './database/Provider';

/**
 * @description holds context for Apollo Server
 */

export interface IAppGqlContext {
  dbConn: Connection;
}

export const context = async (): Promise<IAppGqlContext> => {
  const dbConn = await getConnection();
  return { dbConn };
};
