import { gql } from 'apollo-server-express';

export const InvitationSchema = gql`
  type Invitation {
    id: String!
    firstName: String!
    lastName: String!
    welcomeMessage: String!
    accepted: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input InviteInput {
    phoneNumber: String!
    firstName: String!
    lastName: String!
    welcomeMessage: String!
    influencerId: String
  }

  extend type Query {
    invitation(slug: String!): Invitation
  }

  extend type Mutation {
    createAccountWithInvitation(code: String!): UserAccount!
    confirmAccountWithInvitation(code: String!, otp: String!): UserAccount!
  }

  extend type Assistant {
    invitation: Invitation
  }
`;
