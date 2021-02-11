import { IAppGqlContext } from 'context';
import { IUserAccount, UserAccountStatus } from '../dto/UserAccount';
import { IAccount } from 'models/AccountModel';
import { getAccount } from '../controllers/AccountController';

/**
 * @description holds user account queries
 */

export const UserAccountQuery = {
  myAccount: {
    // TODO: figure out proper internal/application level types/interfaces
    resolve: async (parent: any, args: any, context: IAppGqlContext, info: any): Promise<IUserAccount> => {
      console.log(`parent: ${parent}`);
      console.log(`args: ${args}`);
      console.log(`context: ${context}`);
      console.log(`info: ${info}`);

      const fakeId = 'asdf';
      // return await getAccount(context.dbConn, args.id);
      // const acc: IAccount = await getAccount(context.dbConn, fakeId);
      // return presented IUserAccount
      return <IUserAccount>{ id: '123', authzId: '456', status: UserAccountStatus.PHONE_NUMBER_REQUIRED };
    },
  },
};
