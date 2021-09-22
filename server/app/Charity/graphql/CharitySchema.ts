import { gql } from 'apollo-server-express';
export const CharitySchema = gql`
  enum CharityStatus {
    PENDING_INVITE
    PENDING_ONBOARDING
    ACTIVE
    INACTIVE
  }
  enum CharityProfileStatus {
    COMPLETED
    CREATED
  }
  enum CharityStripeStatus {
    PENDING_VERIFICATION
    ACTIVE
    INACTIVE
  }

  enum CharityOrderBy {
    NAME_ASC
    NAME_DESC
    ACTIVATED_AT_ASC
    ACTIVATED_AT_DESC
  }

  type Charity {
    id: String!
    name: String!
    status: CharityStatus!
    profileStatus: CharityProfileStatus!
    stripeStatus: CharityStripeStatus
    userAccount: UserAccount
    stripeAccountId: String
    stripeAccountLink: String
    avatarUrl: String
    profileDescription: String
    websiteUrl: String
    website: String
    followers: [Follow]
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
    website: String
  }
  input CharityFilters {
    query: String
  }

  input CharityParams {
    skip: Int
    size: Int
    filters: CharityFilters
    orderBy: CharityOrderBy
  }

  type CharitiesPage {
    items: [Charity]!
    totalItems: Int!
    size: Int!
    skip: Int!
  }
  type SelectCharitiesList {
    items: [Charity]!
  }

  input CharityFilters {
    query: String
  }

  input CharityParams {
    skip: Int
    size: Int
    filters: CharityFilters
    orderBy: CharityOrderBy
  }

  extend type Query {
    charitiesList(params: CharityParams): CharitiesPage
    charity(id: String!): Charity!
    charitiesSearch(query: String!, status: [CharityStatus]): [Charity!]!
    charitiesSelectList: SelectCharitiesList!
    charities(size: Int!, skip: Int!, status: [CharityStatus]): CharitiesPage!
  }
  extend type Mutation {
    inviteCharity(input: InviteInput!): InvitationId!
    updateCharity(id: String!, input: CharityInput!): Charity!
    updateCharityProfileAvatar(charityId: String!, image: Upload): Charity!
    updateCharityProfile(charityId: String!, input: CharityProfileInput!): Charity!
    followCharity(charityId: String!): Follow
    unfollowCharity(charityId: String!): ResponceId
  }
  extend type UserAccount {
    charity: Charity
  }
`;
