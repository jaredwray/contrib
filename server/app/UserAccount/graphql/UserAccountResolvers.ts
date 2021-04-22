import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';

export const UserAccountResolvers = {
  Query: {
    myAccount: requireAuthenticated(async (parent, args, { user, userAccount }) =>
      userAccount.getAccountByAuthzId(user.id),
    ),
  },
  Mutation: {
    acceptAccountTerms: requireAuthenticated(async (_, { version }, { userAccount, currentAccount }) =>
      userAccount.acceptTerms(currentAccount.mongodbId, version),
    ),
    confirmAccountWithPhoneNumber: requireAuthenticated(
      (parent, { phoneNumber, otp }: { otp: string; phoneNumber: string }, { user, userAccount }) =>
        userAccount.confirmAccountWithPhoneNumber(user.id, phoneNumber, otp),
    ),
    createAccountWithPhoneNumber: requireAuthenticated(
      (parent: unknown, { phoneNumber }: { phoneNumber: string }, { user, userAccount }) =>
        userAccount.createAccountWithPhoneNumber(user.id, phoneNumber),
    ),
  },
};
