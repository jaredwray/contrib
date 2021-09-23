import { gql } from '@apollo/client';

export const InfluencersListQuery = gql`
  query GetInfluencersListQueryList($skip: Int, $size: Int, $filters: InfluencerFilters, $orderBy: InfluencerOrderBy) {
    influencersList(params: { size: $size, skip: $skip, filters: $filters, orderBy: $orderBy }) {
      totalItems
      size
      skip
      items {
        id
        name
        avatarUrl
        sport
        totalRaisedAmount
        followers {
          user
        }
      }
    }
  }
`;

export const AllInfluencersQuery = gql`
  query GetInfluencers($size: Int!, $skip: Int!) {
    influencers(size: $size, skip: $skip) {
      totalItems
      size
      skip
      items {
        id
        name
        sport
        status
      }
    }
  }
`;

export const GetInfluencerQuery = gql`
  query GetInfluencerById($id: String!) {
    influencer(id: $id) {
      avatarUrl
      id
      name
      profileDescription
      sport
      status
      team
      auctions {
        id
        attachments {
          url
          id
        }
        status
        endDate
        startPrice
        startDate
        title
        totalBids
        currentPrice
      }
      totalRaisedAmount
      followers {
        user
        createdAt
      }
    }
  }
`;
export const InfluencersSearch = gql`
  query influencersSearch($query: String!) {
    influencersSearch(query: $query) {
      id
      name
      sport
      status
    }
  }
`;
export const InviteInfluencerMutation = gql`
  mutation InviteInfluencer(
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $welcomeMessage: String!
    $influencerId: String
  ) {
    inviteInfluencer(
      input: {
        firstName: $firstName
        lastName: $lastName
        phoneNumber: $phoneNumber
        welcomeMessage: $welcomeMessage
        influencerId: $influencerId
      }
    ) {
      invitationId
    }
  }
`;

export const ResendInviteMessageMutation = gql`
  mutation ResendInviteMessage($influencerId: String!) {
    resendInviteMessage(influencerId: $influencerId) {
      link
      phoneNumber
      firstName
    }
  }
`;

export const CreateInfluencerMutation = gql`
  mutation CreateInfluencer($name: String!) {
    createInfluencer(input: { name: $name }) {
      id
    }
  }
`;

export const FollowInfluencer = gql`
  mutation FollowInfluencer($influencerId: String!) {
    followInfluencer(influencerId: $influencerId) {
      user
      createdAt
    }
  }
`;

export const UnfollowInfluencer = gql`
  mutation UnfollowInfluencer($influencerId: String!) {
    unfollowInfluencer(influencerId: $influencerId) {
      id
    }
  }
`;
