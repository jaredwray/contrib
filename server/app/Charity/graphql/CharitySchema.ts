import { gql } from 'apollo-server-express';
export const CharitySchema = gql`
  enum StripeCharityStatus {
    PENDING_VERIFICATION
    STRIPE_ACTIVE
    STRIPE_INACTIVE
  }

  enum CharityProfileStatus {
    PENDING_INVITE
    PENDING_ONBOARDING
    COMPLETED
    CREATED
  }

  enum CharityStripeStatus {
    PENDING_VERIFICATION
    STRIPE_ACTIVE
    STRIPE_INACTIVE
  }

  enum CharityStatus {
    ACTIVE
    INACTIVE
  }

  type Charity {
    id: String!
    name: String!
    status: CharityStatus!
    stripeStatus: StripeCharityStatus
    profileStatus: CharityProfileStatus!
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
