import { gql } from '@apollo/client';

export const AcceptAccountTermsMutation = gql`
  mutation acceptAccountTerms($version: String!) {
    acceptAccountTerms(version: $version) {
      id
    }
  }
`;
