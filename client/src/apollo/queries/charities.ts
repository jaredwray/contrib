import { gql } from '@apollo/client';

export const AllCharitiesQuery = gql`
  query GetCharities($size: Int!, $skip: Int!, $status: [CharityStatus]) {
    charities(size: $size, skip: $skip, status: $status) {
      totalItems
      size
      skip
      items {
        id
        name
        status
        profileStatus
        stripeStatus
      }
    }
  }
`;

export const CharitiesListQuery = gql`
  query GetCharitiesList($skip: Int, $size: Int, $filters: CharityFilters, $orderBy: CharityOrderBy) {
    charitiesList(params: { size: $size, skip: $skip, filters: $filters, orderBy: $orderBy }) {
      totalItems
      size
      skip
      items {
        id
        name
        avatarUrl
        followers {
          user
        }
      }
    }
  }
`;

export const ActiveCharitiesList = gql`
  query GetActiveCharities {
    charitiesSelectList {
      items {
        id
        name
      }
    }
  }
`;

export const InviteCharityMutation = gql`
  mutation InviteCharity($firstName: String!, $lastName: String!, $phoneNumber: String!, $welcomeMessage: String!) {
    inviteCharity(
      input: { firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, welcomeMessage: $welcomeMessage }
    ) {
      invitationId
    }
  }
`;

export const CharitiesSearch = gql`
  query charitiesSearch($query: String!, $status: [CharityStatus]) {
    charitiesSearch(query: $query, status: $status) {
      id
      name
      status
      profileStatus
      stripeStatus
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

export const UpdateFavoriteCharities = gql`
  mutation updateFavoriteCarities($influencerId: String!, $charities: [String!]!) {
    updateInfluencerProfileFavoriteCharities(influencerId: $influencerId, charities: $charities) {
      id
      name
    }
  }
`;
