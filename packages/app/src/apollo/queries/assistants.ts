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
  mutation InviteAssistant($input: InviteInput!) {
    inviteAssistant(input: $input) {
      invitationId
    }
  }
`;
