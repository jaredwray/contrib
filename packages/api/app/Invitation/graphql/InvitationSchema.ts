import { gql } from 'apollo-server-express';

export const InvitationSchema = gql`
  enum InvitationStatus {
    DONE
    PENDING
    PROPOSED
    DECLINED
  }

  type Invitation {
    id: String!
    phoneNumber: String!
    firstName: String!
    lastName: String
    welcomeMessage: String
    status: InvitationStatus
    parentEntityType: String!
    parentEntityId: String
    accepted: Boolean
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type InvitationId {
    invitationId: String
  }

  type InvitationsList {
    items: [Invitation]!
    totalItems: Int!
    size: Int!
    skip: Int!
  }

  input InviteInput {
    phoneNumber: String!
    firstName: String!
    lastName: String
    welcomeMessage: String
    influencerId: String
    parentEntityType: String
  }
  input InvitationsParams {
    skip: Int
    size: Int
    filters: InvitationFilters
  }
  input InvitationFilters {
    query: String
  }

  extend type Query {
    invitation(slug: String!): Invitation
    invitations(params: InvitationsParams): InvitationsList!
  }

  extend type Mutation {
    inviteAssistant(input: InviteInput!): InvitationId!
    inviteCharity(input: InviteInput!): InvitationId!
    inviteInfluencer(input: InviteInput!): InvitationId!
    resendInviteMessage(influencerId: String!): ResendInviteResponce!
    approveInvitation(id: String!): Invitation
    declineInvitation(id: String!): Invitation
    proposeInvitation(input: InviteInput): InvitationId!
    createAccountWithInvitation(code: String!): UserAccount!
    confirmAccountWithInvitation(code: String!, otp: String!): UserAccount!
  }

  extend type Assistant {
    invitation: Invitation
  }
`;
