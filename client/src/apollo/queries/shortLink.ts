import { gql } from '@apollo/client';

export const GetLinkQuery = gql`
  query GetLink($slug: String) {
    getLink(slug: $slug) {
      id
      link
    }
  }
`;
