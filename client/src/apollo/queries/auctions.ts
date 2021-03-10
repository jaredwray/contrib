import { gql } from '@apollo/client';

export const getAuctionBasics = gql`
  query getAuction($id: String!) {
    auction(id: $id) {
      id
      title
      gameWorn
      autographed
      authenticityCertificate
      playedIn
      description
      fullPageDescription
    }
  }
`;

export const getAuctionMedia = gql`
  query getAuction($id: String!) {
    auction(id: $id) {
      video
      photo
    }
  }
`;

export const getAuctionDetails = gql`
  query getAuction($id: String!) {
    auction(id: $id) {
      id
      startDate
      endDate
      initialPrice
      charity {
        id
        name
      }
    }
  }
`;

export const createAuctionMutation = gql`
  mutation createAuction(
    $title: String!
    $gameWorn: Boolean
    $autographed: Boolean
    $authenticityCertificate: Boolean
    $playedIn: String
    $description: String
    $fullPageDescription: String
  ) {
    createAuction(
      input: {
        description: $description
        fullPageDescription: $fullPageDescription
        gameWorn: $gameWorn
        autographed: $autographed
        playedIn: $playedIn
        title: $title
        authenticityCertificate: $authenticityCertificate
      }
    ) {
      id
    }
  }
`;

export const updateAuctionBasics = gql`
  mutation updateAuction(
    $id: String!
    $title: String!
    $gameWorn: Boolean
    $autographed: Boolean
    $authenticityCertificate: Boolean
    $playedIn: String
    $description: String
    $fullPageDescription: String
  ) {
    updateAuction(
      id: $id
      input: {
        description: $description
        fullPageDescription: $fullPageDescription
        gameWorn: $gameWorn
        autographed: $autographed
        playedIn: $playedIn
        title: $title
        authenticityCertificate: $authenticityCertificate
      }
    ) {
      id
    }
  }
`;

export const updateAuctionDetails = gql`
  mutation updateAuction($id: String!, $startDate: DateTime, $endDate: DateTime, $initialPrice: Money) {
    updateAuction(id: $id, input: { startDate: $startDate, endDate: $endDate, initialPrice: $initialPrice }) {
      id
    }
  }
`;

export const updateAuctionMedia = gql`
  mutation updateAuction($id: String!, $file: Upload!) {
    addAuctionAttachment(id: $id, attachment: $file) {
      attachments {
        url
        type
      }
      id
    }
  }
`;

export const updateAuctionStatusMutation = gql`
  mutation updateAuctionStatus($id: String!, $status: String!) {
    updateAuctionStatus(id: $id, status: $status) {
      id
    }
  }
`;
