import { gql } from '@apollo/client';

export const AuctionPriceLimitsQuery = gql`
  query auctionPriceLimits {
    auctionPriceLimits {
      max
      min
    }
  }
`;

export const getAuction = gql`
  query getAuction($id: String!) {
    auction(id: $id) {
      id
      startDate
      endDate
      initialPrice
      title
      gameWorn
      autographed
      authenticityCertificate
      playedIn
      description
      fullPageDescription
      status
      bids {
        bid
        createdAt
        id
      }
      auctionOrganizer {
        id
        name
        avatarUrl
      }
      attachments {
        uid
        url
        type
        cloudflareUrl
        thumbnail
      }
      charity {
        id
        name
      }
    }
  }
`;

export const getAuctionBasics = gql`
  query getAuction($id: String!) {
    auction(id: $id) {
      id
      title
      sport
      gameWorn
      autographed
      authenticityCertificate
      playedIn
      description
      fullPageDescription
    }
  }
`;

export const GetAuctionMedia = gql`
  query getAuction($id: String!) {
    auction(id: $id) {
      attachments {
        uid
        url
        type
        cloudflareUrl
        thumbnail
      }
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
    $sport: String!
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
        sport: $sport
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
    $sport: String!
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
        sport: $sport
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
  mutation updateAuction(
    $id: String!
    $startDate: DateTime
    $endDate: DateTime
    $initialPrice: Money
    $charity: String
  ) {
    updateAuction(
      id: $id
      input: { startDate: $startDate, endDate: $endDate, initialPrice: $initialPrice, charity: $charity }
    ) {
      id
    }
  }
`;

export const AddAuctionMedia = gql`
  mutation addAuctionAttachment($id: String!, $file: Upload!) {
    addAuctionAttachment(id: $id, attachment: $file) {
      url
      type
      cloudflareUrl
      thumbnail
      uid
      originalFileName
    }
  }
`;

export const RemoveAuctionMedia = gql`
  mutation removeAuctionAttachment($id: String!, $url: String!) {
    removeAuctionAttachment(id: $id, attachmentUrl: $url) {
      url
      type
      cloudflareUrl
      thumbnail
      uid
    }
  }
`;

export const AuctionsListQuery = gql`
  query auctions($size: Int!, $skip: Int!, $query: String, $orderBy: String, $filters: AuctionSearchFilters) {
    auctions(size: $size, skip: $skip, query: $query, orderBy: $orderBy, filters: $filters) {
      totalItems
      size
      skip
      items {
        id
        bids {
          bid
          createdAt
          id
        }
        title
        description
        initialPrice
        endDate
        auctionOrganizer {
          id
          name
          avatarUrl
        }
        attachments {
          type
          url
        }
      }
    }
  }
`;

export const updateAuctionStatusMutation = gql`
  mutation updateAuctionStatus($id: String!, $status: AuctionStatus!) {
    updateAuctionStatus(id: $id, status: $status) {
      id
    }
  }
`;

export const SportsQuery = gql`
  query sports {
    sports
  }
`;
