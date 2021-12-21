import { gql } from '@apollo/client';

export const CharitiesListQuery = gql`
  query GetCharitiesList($skip: Int, $size: Int, $filters: CharityFilters, $orderBy: CharityOrderBy) {
    charitiesList(params: { size: $size, skip: $skip, filters: $filters, orderBy: $orderBy }) {
      totalItems
      size
      skip
      items {
        id
        name
        semanticId
        avatarUrl
        status
        profileStatus
        stripeStatus
        totalRaisedAmount
        followers {
          user
        }
      }
    }
  }
`;

export const ActiveCharitiesList = gql`
  query GetActiveCharities($filters: CharityFilters) {
    charitiesList(params: { filters: $filters }) {
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

export const UpdateFavoriteCharities = gql`
  mutation updateFavoriteCharities($influencerId: String!, $charities: [String!]!) {
    updateInfluencerProfileFavoriteCharities(influencerId: $influencerId, charities: $charities) {
      id
      name
    }
  }
`;
