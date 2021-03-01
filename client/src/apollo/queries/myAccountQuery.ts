import { gql } from '@apollo/client';

export const MyAccountQuery = gql`
  query GetMyAccount {
    myAccount {
      id
      phoneNumber
      status
      influencerProfile {
        id
        profileDescription
        name
        sport
        team
        avatarUrl
        status
      }
    }
  }
`;
