import gql from 'graphql-tag';

export const RegisterPaymentMethodMutation = gql`
  mutation RegisterPaymentMethod($token: String!) {
    enterPaymentInformation(input: { stripeSourceToken: $token }) {
      id
      paymentInformation {
        id
        cardNumberLast4
        cardBrand
        cardExpirationMonth
        cardExpirationYear
      }
    }
  }
`;
