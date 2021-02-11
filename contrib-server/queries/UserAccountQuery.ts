import { IAppGqlContext } from 'context';
import { IUserAccount, UserAccountStatus } from '../dto/UserAccount';
import { IAccount } from 'models/AccountModel';
import { getAccountByAuthzId } from '../controllers/AccountController';

/**
 * @description holds user account queries
 */

export const UserAccountQuery = {
  myAccount: {
    resolve: async (parent: unknown, args: unknown, context: IAppGqlContext, info: unknown): Promise<IUserAccount> => {
      const authzId: string = context.authUser.sub;
      const dbAccount: IAccount = await getAccountByAuthzId(context.dbConn, authzId);
      return <IUserAccount>{
        id: authzId,
        phoneNumber: dbAccount?.phoneNumber || null,
        status: dbAccount ? UserAccountStatus.COMPLETED : UserAccountStatus.PHONE_NUMBER_REQUIRED,
      };
    },
  },
};
