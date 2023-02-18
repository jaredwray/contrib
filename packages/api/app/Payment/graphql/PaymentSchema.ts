import { gql } from 'apollo-server-express';

export const PaymentSchema = gql`
  type PaymentInformation {
    id: String!
    cardNumberLast4: String!
    cardBrand: String!
    cardExpirationMonth: Int!
    cardExpirationYear: Int!
  }

  extend type UserAccount {
    paymentInformation: PaymentInformation
  }

  input PaymentInformationInput {
    stripeSourceToken: String!
  }

  extend type Mutation {
    enterPaymentInformation(input: PaymentInformationInput): UserAccount!
  }
`;
