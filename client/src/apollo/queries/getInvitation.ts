import { gql } from '@apollo/client';

export const GetInvitation = gql`
  query GetInvitation($slug: String!) {
    invitation(slug: $slug) {
      firstName
      welcomeMessage
      accepted
    }
  }
`;
