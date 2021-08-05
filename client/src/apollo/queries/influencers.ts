import { gql } from '@apollo/client';

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
      followers {
        user
        createdAt
      }
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
