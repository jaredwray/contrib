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
        status
        totalRaisedAmount
        followers {
          user
        }
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
        endsAt
        startPrice
        startsAt
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

export const TopEarnedInfluencerQuery = gql`
  query TopEarnedInfluencer {
    topEarnedInfluencer {
      id
      name
      totalRaisedAmount
      avatarUrl
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
