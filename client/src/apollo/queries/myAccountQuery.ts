import { gql } from '@apollo/client';

export const MyAccountQuery = gql`
  query GetMyAccount {
    myAccount {
      id
      phoneNumber
      status
      isAdmin
      createdAt
      notAcceptedTerms
      charity {
        id
        name
        status
        profileStatus
        stripeStatus
        stripeAccountLink
      }
      influencerProfile {
        id
        profileDescription
        name
        sport
        team
        avatarUrl
        status
      }
      assistant {
        name
        status
        influencerId
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
