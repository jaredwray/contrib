import { gql } from '@apollo/client';

export const InvitationsQuery = gql`
  query InvitationsQuery($params: InvitationsParams) {
    invitations(params: $params) {
      totalItems
      size
      skip
      items {
        id
        phoneNumber
        firstName
        lastName
        status
        accepted
        parentEntityType
        parentEntityId
        createdAt
        updatedAt
      }
    }
  }
`;

export const ProposeInvitationMutation = gql`
  mutation ProposeInvitation($input: InviteInput!) {
    proposeInvitation(input: $input) {
      invitationId
    }
  }
`;

export const InviteInfluencerMutation = gql`
  mutation InviteInfluencer($input: InviteInput!) {
    inviteInfluencer(input: $input) {
      invitationId
    }
  }
`;

export const ResendInviteMessageMutation = gql`
  mutation ResendInviteMessage($influencerId: String!) {
    resendInviteMessage(influencerId: $influencerId) {
      link
      phoneNumber
      firstName
    }
  }
`;

export const ApproveInvitationMutation = gql`
  mutation ApproveInvitationMutation($id: String!) {
    approveInvitation(id: $id) {
      status
    }
  }
`;

export const DeclineInvitationMutation = gql`
  mutation DeclineInvitationMutation($id: String!) {
    declineInvitation(id: $id) {
      status
    }
  }
`;
