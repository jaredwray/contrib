import { gql } from 'apollo-server-express';

export const AssistantSchema = gql`
  enum AssistantStatus {
    INVITATION_PENDING
    ONBOARDED
  }

  type Assistant {
    id: String!
    name: String!
    status: AssistantStatus!
    userAccount: UserAccount
    influencerId: String!
    notAcceptedTerms: TermsInput
  }

  extend type Mutation {
    inviteAssistant(input: InviteInput!): Assistant!
    acceptAssistantTerms(version: String!): Assistant!
  }

  extend type UserAccount {
    assistant: Assistant
  }
`;
