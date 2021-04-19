import { gql } from '@apollo/client';

export const MyAccountQuery = gql`
  query GetMyAccount {
    myAccount {
      id
      phoneNumber
      status
      isAdmin
      createdAt
      notAcceptedTerms {
        version
        date
      }
      influencerProfile {
        id
        profileDescription
        name
        sport
        team
        avatarUrl
        status
        notAcceptedTerms {
          version
          date
        }
      }
      assistant {
        name
        status
        influencerId
        notAcceptedTerms {
          version
          date
        }
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
