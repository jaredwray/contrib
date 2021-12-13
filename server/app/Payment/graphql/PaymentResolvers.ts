import { UserAccount } from 'app/UserAccount/dto/UserAccount';
import { GraphqlResolver } from '../../../graphql/types';
import { PaymentInformation } from '../dto/PaymentInformation';
import { PaymentInformationInput } from './model/PaymentInformationInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';

interface PaymentResolversType {
  UserAccount: {
    paymentInformation: GraphqlResolver<PaymentInformation | null, Record<string, any>, UserAccount>;
  };
  Mutation: {
    enterPaymentInformation: GraphqlResolver<UserAccount, { input: PaymentInformationInput }>;
  };
}

export const PaymentResolvers: PaymentResolversType = {
  UserAccount: {
    paymentInformation: requireAuthenticated((userAccount, _, { currentAccount, payment }) => {
      if (userAccount.id !== currentAccount.id) {
        return null;
      }
      return payment.getAccountPaymentInformation(currentAccount);
    }),
  },
  Mutation: {
    enterPaymentInformation: requireAuthenticated((_, { input }, { payment, currentAccount, user }) =>
      payment.updateAccountPaymentInformation(currentAccount, input.stripeSourceToken, user),
    ),
  },
};
