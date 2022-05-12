import { gql } from 'apollo-server-express';

export const InvitationSchema = gql`
  enum InvitationStatus {
    PENDING
    PROPOSED
    DECLINED
  }

  type Invitation {
    id: String!
    firstName: String!
    lastName: String
    welcomeMessage: String
    status: InvitationStatus
    accepted: Boolean
    createdAt: String!
    updatedAt: String!
  }

  type InvitationId {
    invitationId: String!
  }

  input InviteInput {
    phoneNumber: String!
    firstName: String!
    lastName: String
    welcomeMessage: String
    influencerId: String
  }

  extend type Query {
    invitation(slug: String!): Invitation
  }

  extend type Mutation {
    proposeInvitation(input: InviteInput): Invitation!
    createAccountWithInvitation(code: String!): UserAccount!
    confirmAccountWithInvitation(code: String!, otp: String!): UserAccount!
  }

  extend type Assistant {
    invitation: Invitation
  }
`;
