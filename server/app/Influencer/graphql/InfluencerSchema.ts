import { gql } from 'apollo-server-express';

export const InfluencerSchema = gql`
  enum InfluencerStatus {
    TRANSIENT
    INVITATION_PENDING
    ONBOARDED
  }

  enum InfluencerOrderBy {
    NAME_ASC
    NAME_DESC
    ONBOARDED_AT_ASC
    ONBOARDED_AT_DESC
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
    followers: [Follow]
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
  }
  input InfluencerParams {
    skip: Int
    size: Int
    filters: InfluencerFilters
    orderBy: InfluencerOrderBy
  }
  
  extend type Query {
    influencersList(params: InfluencerParams): InfluencersPage
    influencers(size: Int!, skip: Int!): InfluencersPage!
    influencersSearch(query: String!): [InfluencerProfile!]
    influencer(id: String!): InfluencerProfile
  }

  extend type Mutation {
    createInfluencer(input: CreateInfluencerInput!): InfluencerProfile!
    inviteInfluencer(input: InviteInput!): InvitationId!
    resendInviteMessage(influencerId: String!): ResendInviteResponce!
    updateInfluencerProfile(influencerId: String!, input: UpdateInfluencerProfileInput!): InfluencerProfile!
    updateInfluencerProfileAvatar(influencerId: String!, image: Upload!): InfluencerProfile!
    updateInfluencerProfileFavoriteCharities(influencerId: String!, charities: [String!]!): InfluencerProfile!
    updateMyInfluencerProfile(input: UpdateInfluencerProfileInput!): InfluencerProfile!
    updateMyInfluencerProfileAvatar(image: Upload!): InfluencerProfile!
    updateMyInfluencerProfileFavoriteCharities(charities: [String!]!): InfluencerProfile!
    followInfluencer(influencerId: String!): Follow
    unfollowInfluencer(influencerId: String!): ResponceId
  }

  extend type UserAccount {
    influencerProfile: InfluencerProfile
  }
`;
