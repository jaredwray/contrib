import { gql } from 'apollo-server-express';

export const InfluencerSchema = gql`
  enum InfluencerStatus {
    TRANSIENT
    INVITATION_PENDING
    ONBOARDED
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
  }

  type InfluencersPage {
    items: [InfluencerProfile]!
    totalItems: Int!
    size: Int!
    skip: Int!
  }

  extend type Query {
    influencers(size: Int!, skip: Int!): InfluencersPage!
    influencer(id: String!): InfluencerProfile!
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

  extend type Mutation {
    createInfluencer(input: CreateInfluencerInput!): InfluencerProfile!
    inviteInfluencer(input: InviteInput!): InfluencerProfile!
    updateInfluencerProfile(influencerId: String!, input: UpdateInfluencerProfileInput!): InfluencerProfile!
    updateInfluencerProfileAvatar(influencerId: String!, image: Upload!): InfluencerProfile!
    updateInfluencerProfileFavoriteCharities(influencerId: String!, charities: [String!]!): InfluencerProfile!
    updateMyInfluencerProfile(input: UpdateInfluencerProfileInput!): InfluencerProfile!
    updateMyInfluencerProfileAvatar(image: Upload!): InfluencerProfile!
    updateMyInfluencerProfileFavoriteCharities(charities: [String!]!): InfluencerProfile!
  }

  extend type UserAccount {
    influencerProfile: InfluencerProfile
  }
`;
