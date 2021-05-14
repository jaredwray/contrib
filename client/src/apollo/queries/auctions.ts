import { gql } from '@apollo/client';

export const AuctionPriceLimitsQuery = gql`
  query auctionPriceLimits {
    auctionPriceLimits {
      max
      min
    }
  }
`;

export const AuctionQuery = gql`
  query AuctionQuery($id: String!) {
    auction(id: $id) {
      id
      startDate
      endDate
      startPrice
      title
      gameWorn
      autographed
      authenticityCertificate
      playedIn
      description
      fullPageDescription
      status
      startPrice
      totalBids
      link
      maxBid {
        id
        bid
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
        avatarUrl
        websiteUrl
        status
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
      link
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
      startPrice
      link
      charity {
        id
        name
      }
      auctionOrganizer {
        favoriteCharities {
          id
          name
        }
      }
    }
  }
`;

export const createAuctionMutation = gql`
  mutation createAuction(
    $organizerId: String
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
        organizerId: $organizerId
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
      description
      fullPageDescription
      gameWorn
      autographed
      playedIn
      title
      sport
      authenticityCertificate
      link
    }
  }
`;

export const MakeAuctionBidMutation = gql`
  mutation createAuctionBid($id: String!, $bid: Money!) {
    createAuctionBid(id: $id, bid: $bid) {
      id
      maxBid {
        id
        bid
      }
      totalBids
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
      description
      sport
      fullPageDescription
      gameWorn
      autographed
      playedIn
      title
      authenticityCertificate
      link
    }
  }
`;

export const updateAuctionDetails = gql`
  mutation updateAuction($id: String!, $startDate: DateTime, $endDate: DateTime, $startPrice: Money, $charity: String) {
    updateAuction(
      id: $id
      input: { startDate: $startDate, endDate: $endDate, startPrice: $startPrice, charity: $charity }
    ) {
      id
      startDate
      endDate
      startPrice
      charity {
        id
        name
      }
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
  query auctions($size: Int, $skip: Int, $query: String, $orderBy: String, $filters: AuctionSearchFilters) {
    auctions(size: $size, skip: $skip, query: $query, orderBy: $orderBy, filters: $filters) {
      totalItems
      size
      skip
      items {
        id
        maxBid {
          id
          bid
        }
        totalBids
        status
        title
        description
        startPrice
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
