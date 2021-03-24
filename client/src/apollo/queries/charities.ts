import { gql } from '@apollo/client';

export const CharitiesSearch = gql`
  query charitiesSearch($query: String!) {
    charitiesSearch(query: $query) {
      id
      name
    }
  }
`;

export const UpdateMyFavoriteCharities = gql`
  mutation updateMyFavoriteCarities($charities: [String!]!) {
    updateMyInfluencerProfileFavoriteCharities(charities: $charities) {
      id
      name
    }
  }
`;
