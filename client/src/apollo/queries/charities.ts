import { gql } from '@apollo/client';

export const MyCharitiesQuery = gql`
  query GetMyCharitiesQuery {
    myAccount {
      influencerProfile {
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

export const UpdateMyFavoriteCarities = gql`
  mutation updateMyFavoriteCarities($charities: [String!]!) {
    updateMyInfluencerProfileFavoriteCharities(charities: $charities) {
      id
      name
    }
  }
`;
