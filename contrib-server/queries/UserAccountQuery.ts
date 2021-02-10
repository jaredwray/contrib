import { IAccount } from 'models/AccountModel';
import { getAccount } from '../controllers/AccountController';

/**
 * @description holds user account queries
 */

export const UserAccountQuery = {
  myAccount: {
    // TODO: figure out proper internal/application level types/interfaces
    resolve: async (parent: any, args: any, context: any, info: any): Promise<IAccount> => {
      const fakeId = 'asdf';
      // return await getAccount(context.dbConn, args.id);
      const acc: IAccount = await getAccount(context.dbConn, fakeId);
      // return presented IUserAccount
      return acc;
    },
  },
};
