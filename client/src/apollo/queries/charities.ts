import { gql } from '@apollo/client';

export const MyFavoriteCharitiesQuery = gql`
  query GetMyFavoriteCharitiesQuery {
    myAccount {
      id
      influencerProfile {
        id
        favoriteCharities {
          id
          name
        }
      }
    }
  }
`;

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
