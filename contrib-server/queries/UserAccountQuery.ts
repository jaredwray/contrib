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
    resolve: async (parent: unknown, args: unknown, context: IAppGqlContext, info: unknown): Promise<IUserAccount> => {
      console.log(`parent: ${parent}`);
      console.log(`args: ${args}`);
      console.log(`context: ${context}`);
      console.log(`info: ${JSON.stringify(info)}`);

      // const fakeId = 'asdf';
      // return await getAccount(context.dbConn, args.id);
      // const acc: IAccount = await getAccount(context.dbConn, fakeId);
      // return presented IUserAccount
      console.log('before response');
      return <IUserAccount>{ id: '123', authzId: '456', status: UserAccountStatus.PHONE_NUMBER_REQUIRED };
    },
  },
};
