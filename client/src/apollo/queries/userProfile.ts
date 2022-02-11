import { gql } from '@apollo/client';

export const GetAuctionsForProfilePageQuery = gql`
  query GetAuctionsForProfilePage {
    getAuctionsForProfilePage {
      won {
        id
        currentPrice
        totalBids
        status
        title
        isSettled
        isSold
        startPrice
        itemPrice
        startDate
        endDate
        auctionOrganizer {
          id
          name
          avatarUrl
        }
        attachments {
          type
          url
          thumbnail
        }
        followers {
          user
        }
      }
      live {
        id
        currentPrice
        totalBids
        status
        isSettled
        isSold
        title
        startPrice
        itemPrice
        startDate
        endDate
        auctionOrganizer {
          id
          name
          avatarUrl
        }
        attachments {
          type
          url
          thumbnail
        }
        followers {
          user
        }
      }
    }
  }
`;

export const VerifyChangePhoneNumberMutation = gql`
  mutation VerifyChangePhoneNumberMutation($phoneNumber: String) {
    verifyChangePhoneNumber(phoneNumber: $phoneNumber) {
      phoneNumber
    }
  }
`;

export const ConfirmChangePhoneNumberMutation = gql`
  mutation ConfirmChangePhoneNumberMutation($phoneNumber: String, $otp: String) {
    confirmChangePhoneNumber(phoneNumber: $phoneNumber, otp: $otp) {
      phoneNumber
    }
  }
`;
