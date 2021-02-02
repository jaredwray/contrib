import { gql } from '@apollo/client';

export const MyAccountQuery = gql`
  query GetMyAccount {
    myAccount {
      id
      phoneNumber
      status
    }
  }
`;
