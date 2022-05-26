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
    influencerId: String
    influencerIds: [String]
    influencers: [String]
    notAcceptedTerms: String
  }

  extend type UserAccount {
    assistant: Assistant
  }
`;
