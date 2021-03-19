import { gql } from 'apollo-server-express';

export const InfluencerSchema = gql`
  enum InfluencerStatus {
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
  }

  type Invitation {
    id: String!
    firstName: String!
    lastName: String!
    welcomeMessage: String!
    accepted: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type InfluencersPage {
    items: [InfluencerProfile]!
    totalItems: Int!
    size: Int!
    skip: Int!
  }

  extend type Query {
    invitation(slug: String!): Invitation
    influencers(size: Int!, skip: Int!): InfluencersPage!
    influencer(id: String!): InfluencerProfile!
  }

  input InviteInfluencerInput {
    phoneNumber: String!
    firstName: String!
    lastName: String!
    welcomeMessage: String!
  }

  input UpdateInfluencerProfileInput {
    name: String!
    sport: String!
    team: String!
    profileDescription: String!
    image: Upload
  }

  extend type Mutation {
    inviteInfluencer(input: InviteInfluencerInput!): InfluencerProfile!
    updateMyInfluencerProfile(input: UpdateInfluencerProfileInput!): InfluencerProfile!
    updateMyInfluencerProfileAvatar(image: Upload!): InfluencerProfile!
    updateMyInfluencerProfileFavoriteCharities(charities: [String!]!): InfluencerProfile!

    createAccountWithInvitation(code: String!): UserAccount!
    confirmAccountWithInvitation(code: String!, otp: String!): UserAccount!
  }

  extend type UserAccount {
    influencerProfile: InfluencerProfile
  }
`;
