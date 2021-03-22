import { gql } from '@apollo/client';

export const MyAccountQuery = gql`
  query GetMyAccount {
    myAccount {
      id
      phoneNumber
      status
      isAdmin
      influencerProfile {
        id
        profileDescription
        name
        sport
        team
        avatarUrl
        status
      }
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
