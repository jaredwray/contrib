import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';

export const UserAccountResolvers = {
  Query: {
    myAccount: requireAuthenticated(async (parent, args, { user, userAccount }) =>
      userAccount.getAccountByAuthzId(user.id),
    ),
  },
  Mutation: {
    confirmAccountWithPhoneNumber: requireAuthenticated(
      (
        parent,
        { input: { phoneNumber, otp } }: { input: { otp: string; phoneNumber: string } },
        { user, userAccount },
      ) => userAccount.confirmAccountWithPhoneNumber(user.id, phoneNumber, otp),
    ),
    createAccountWithPhoneNumber: requireAuthenticated(
      (parent: unknown, { input: { phoneNumber } }: { input: { phoneNumber: string } }, { user, userAccount }) =>
        userAccount.createAccountWithPhoneNumber(user.id, phoneNumber),
    ),
  },
};
