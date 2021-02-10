// import {  } from '../controllers/UserAccountController';

/**
 * @description holds user mutations
 */

export const UserAccountMutation = {
  createAccountWithPhoneNumber: {
    resolve: async (parent, args, context, info) => {
      return await createUser(context.dbConn, args.input);
    },
  },
  confirmAccountWithPhoneNumber: {
    resolve: async (parent, args, context, info) => {
      return await updateUser(context.dbConn, args.input);
    },
  },
};
