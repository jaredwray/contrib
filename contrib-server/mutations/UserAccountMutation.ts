// import {  } from '../controllers/UserAccountController';

import { IAppGqlContext } from 'context';
import { IUserAccount, UserAccountStatus } from '../dto/UserAccount';

/**
 * @description holds user mutations
 */

export const UserAccountMutation = {
  createAccountWithPhoneNumber: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    resolve: async (parent: any, args: any, context: IAppGqlContext, info: any): Promise<IUserAccount> => {
      // return await createUser(context.dbConn, args.input);
      // const acc: IUserAccount{};
      return <IUserAccount>{
        id: '123',
        authzId: '456',
        status: UserAccountStatus.PHONE_NUMBER_REQUIRED,
      };
    },
  },
  confirmAccountWithPhoneNumber: {
    resolve: async (parent: any, args: any, context: IAppGqlContext, info: any): Promise<IUserAccount> => {
      // return await updateUser(context.dbConn, args.input);
      return <IUserAccount>{
        id: '123',
        authzId: '456',
        status: UserAccountStatus.PHONE_NUMBER_REQUIRED,
      };
    },
  },
};
