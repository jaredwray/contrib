import { gql } from '@apollo/client';

export const AssistantsQuery = gql`
  query GetInfluencerProfileById($id: String!) {
    influencer(id: $id) {
      id
      name
      assistants {
        id
        name
        status
      }
    }
  }
`;

export const InviteAssistantMutation = gql`
  mutation InviteAssistant(
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $welcomeMessage: String!
    $influencerId: String
  ) {
    inviteAssistant(
      input: {
        firstName: $firstName
        lastName: $lastName
        phoneNumber: $phoneNumber
        welcomeMessage: $welcomeMessage
        influencerId: $influencerId
      }
    ) {
      invitationId
    }
  }
`;
