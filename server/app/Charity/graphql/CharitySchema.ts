import { gql } from 'apollo-server-express';
export const CharitySchema = gql`
  enum CharityStatus {
    PENDING_INVITE
    PENDING_ONBOARDING
    PENDING_VERIFICATION
    ACTIVE
    INACTIVE
  }
  type Charity {
    id: String!
    name: String!
    status: String!
    userAccount: UserAccount
    stripeAccountId: String
    stripeAccountLink: String
    avatarUrl: String
    profileDescription: String
    websiteUrl: String
  }
  input CharityInputID {
    id: String!
  }
  input CharityInput {
    name: String!
  }
  input CharityProfileInput {
    name: String
    profileDescription: String
    websiteUrl: String
  }
  type CharitiesPage {
    items: [Charity]!
    totalItems: Int!
    size: Int!
    skip: Int!
  }
  extend type Query {
    charity(id: String!): Charity!
    charitiesSearch(query: String!): [Charity!]!
    charities(size: Int!, skip: Int!): CharitiesPage!
  }
  extend type Mutation {
    inviteCharity(input: InviteInput!): Charity!
    updateCharity(id: String!, input: CharityInput!): Charity!
    updateCharityProfileAvatar(charityId: String!, image: Upload): Charity!
    updateCharityProfile(charityId: String!, input: CharityProfileInput!): Charity!
  }
  extend type UserAccount {
    charity: Charity
  }
`;
