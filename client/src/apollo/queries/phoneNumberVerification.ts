import { gql } from '@apollo/client';

export const EnterPhoneNumberMutation = gql`
  mutation EnterPhoneNumber($phoneNumber: String!) {
    createAccountWithPhoneNumber(phoneNumber: $phoneNumber) {
      id
      phoneNumber
      status
    }
  }
`;

export const EnterInvitationCodeMutation = gql`
  mutation EnterInvitationCode($code: String!) {
    createAccountWithInvitation(code: $code) {
      id
      phoneNumber
      status
    }
  }
`;
