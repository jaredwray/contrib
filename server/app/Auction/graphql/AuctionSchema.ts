import { gql } from 'apollo-server-express';

export const AuctionSchema = gql`
  type AuctionAttachment {
    uid: String
    url: String!
    type: String!
    cloudflareUrl: String
    thumbnail: String
  }

  enum AuctionStatus {
    DRAFT
    ACTIVE
    SETTLED
  }

  type AuctionStatusResponse {
    status: String!
  }

  type AuctionBid {
    id: String!
    bid: Money!
    createdAt: DateTime!
  }

  type Auction {
    id: String!
    title: String!
    description: String
    fullPageDescription: String
    playedIn: String
    status: AuctionStatus!
    attachments: [AuctionAttachment]
    bids: [AuctionBid]
    startPrice: Money!
    charity: Charity
    gameWorn: Boolean!
    autographed: Boolean!
    authenticityCertificate: Boolean!
    sport: String!
    maxBid: AuctionBid
    startDate: DateTime!
    initialPrice: Money!
    endDate: DateTime!
    auctionOrganizer: String!
  }

  extend type Query {
    auctions(size: Int!, skip: Int!): [Auction!]
    auction(id: String!): Auction
  }

  input AuctionInput {
    title: String
    description: String
    fullPageDescription: String
    startDate: DateTime
    endDate: DateTime
    initialPrice: Money
    charity: String
    authenticityCertificate: Boolean
    gameWorn: Boolean
    autographed: Boolean
    sport: String
    playedIn: String
  }

  extend type Mutation {
    createAuction(input: AuctionInput!): Auction!
    updateAuction(id: String, input: AuctionInput): Auction!
    updateAuctionStatus(id: String!, status: AuctionStatus!): Auction!
    createAuctionBid(id: String!, bid: Money!): AuctionBid!
    addAuctionAttachment(id: String!, attachment: Upload!): Auction!
    removeAuctionAttachment(id: String!, attachmentUrl: String!): Auction!
    deleteAuction(id: String!): AuctionStatusResponse!
  }
`;
