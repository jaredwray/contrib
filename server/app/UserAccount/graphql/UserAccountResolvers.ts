import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';

export const UserAccountResolvers = {
  Query: {
    myAccount: requireAuthenticated(async (parent, args, { user, userAccount }) =>
      userAccount.getAccountByAuthzId(user.id, user),
    ),
    getAccountById: requireAdmin(async (_, { id }, { userAccount }) => await userAccount.getAccountById(id)),
  },
  Mutation: {
    acceptAccountTerms: requireAuthenticated(async (_, { version }, { userAccount, currentAccount }) =>
      userAccount.acceptTerms(currentAccount.mongodbId, version),
    ),
    confirmAccountWithPhoneNumber: requireAuthenticated(
      (parent, { phoneNumber, otp }: { otp: string; phoneNumber: string }, { user, userAccount }) =>
        userAccount.confirmAccountWithPhoneNumber(user.id, phoneNumber, otp),
    ),
    confirmChangePhoneNumber: requireAuthenticated(
      (parent, { phoneNumber, otp }: { otp: string; phoneNumber: string }, { currentAccount, userAccount }) =>
        userAccount.confirmChangePhoneNumber({
          userId: currentAccount.mongodbId,
          newPhoneNumber: phoneNumber,
          oldPhoneNumber: currentAccount.phoneNumber,
          otp,
        }),
    ),
    sendOtp: async (_, { phoneNumber }, { userAccount }) => await userAccount.sendOtp(phoneNumber),
    createAccountWithPhoneNumber: requireAuthenticated(
      (parent: unknown, { phoneNumber }: { phoneNumber: string }, { user, userAccount }) =>
        userAccount.createAccountWithPhoneNumber(user.id, phoneNumber),
    ),
    verifyChangePhoneNumber: requireAuthenticated(
      (parent: unknown, { phoneNumber }: { phoneNumber: string }, { userAccount }) =>
        userAccount.verifyChangePhoneNumber(phoneNumber),
    ),
    createOrUpdateUserAddress: requireAuthenticated(
      async (_, { auctionId, input }, { currentAccount, userAccount }) =>
        await userAccount.createOrUpdateUserAddress(auctionId, currentAccount.mongodbId, input),
    ),
    updateCreditCard: requireAuthenticated(
      async (_, { stripeCustomerId }, { currentAccount, userAccount }) =>
        await userAccount.updateAccountStripeCustomerId(currentAccount, stripeCustomerId),
    ),
  },
};
