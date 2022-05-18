import { gql } from 'apollo-server-express';

export const InfluencerSchema = gql`
  enum InfluencerStatus {
    TRANSIENT
    INVITATION_PENDING
    ONBOARDED
  }

  enum InfluencerOrderBy {
    DEFAULT
    STATUS_ASC
    NAME_ASC
    NAME_DESC
    ONBOARDED_AT_ASC
  }

  type InfluencerProfile {
    id: String!
    name: String!
    sport: String
    team: String
    profileDescription: String
    avatarUrl: String!
    status: InfluencerStatus!
    userAccount: UserAccount
    invitation: Invitation!
    favoriteCharities: [Charity!]!
    assistants: [Assistant!]!
    totalRaisedAmount: Money
    followers: [Follow]
    createdAt: DateTime
    onboardedAt: DateTime
  }

  type InfluencersPage {
    items: [InfluencerProfile]!
    totalItems: Int!
    size: Int!
    skip: Int!
  }

  type Follow {
    user: String
    createdAt: DateTime
  }

  type ResendInviteResponce {
    link: String
    phoneNumber: String
    firstName: String
  }

  input UpdateInfluencerProfileInput {
    name: String!
    sport: String!
    team: String
    profileDescription: String!
    image: Upload
  }

  input CreateInfluencerInput {
    name: String!
  }

  input InfluencerFilters {
    query: String
    status: [InfluencerStatus]
  }
  input InfluencerParams {
    skip: Int
    size: Int
    filters: InfluencerFilters
    orderBy: InfluencerOrderBy
  }

  extend type Query {
    influencersList(params: InfluencerParams): InfluencersPage
    influencer(id: String!): InfluencerProfile
    topEarnedInfluencer: InfluencerProfile
  }

  extend type Mutation {
    createInfluencer(input: CreateInfluencerInput!): InfluencerProfile!
    updateInfluencerProfile(influencerId: String!, input: UpdateInfluencerProfileInput!): InfluencerProfile!
    updateInfluencerProfileAvatar(influencerId: String!, image: Upload!): InfluencerProfile!
    updateInfluencerProfileFavoriteCharities(influencerId: String!, charities: [String!]!): InfluencerProfile!
    followInfluencer(influencerId: String!): Follow
    unfollowInfluencer(influencerId: String!): ResponceId
  }

  extend type UserAccount {
    influencerProfile: InfluencerProfile
  }
`;
