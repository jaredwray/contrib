import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requireRole } from '../../../graphql/middleware/requireRole';

export const UserAccountResolvers = {
  Query: {
    myAccount: requireAuthenticated(async (parent, args, { user, userAccount }) =>
      userAccount.getAccountByAuthzId(user.id),
    ),
  },
  Mutation: {
    acceptAccountTerms: requireRole(async (_, { version }, { userAccount, currentAccount }) =>
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
