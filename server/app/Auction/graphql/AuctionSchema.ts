import { gql } from 'apollo-server-express';

export const AuctionSchema = gql`
  type AuctionAttachment {
    url: String!
    type: String!
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
    user: UserAccount
    bid: Money!
  }

  type Auction {
    id: String!
    title: String!
    description: String
    fullpageDescription: String
    status: AuctionStatus!
    attachments: [AuctionAttachment]
    bids: [AuctionBid]
    charity: Charity
    gameWorn: Boolean!
    autographed: Boolean!
    authenticityCertificate: Boolean!
    sport: String!
    maxBid: AuctionBid
    startDate: DateTime!
    initialPrice: Money!
    endDate: DateTime!
  }

  extend type Query {
    auctions(size: Int!, skip: Int!): [Auction!]!
    auction(id: String!): Auction!
  }

  input BidParticipantUser {
    id: String!
  }

  input CreateAuctionInput {
    title: String!
    description: String
    fullpageDescription: String
  }

  input EditAuctionInput {
    title: String
    description: String
    fullpageDescription: String
    startDate: DateTime
    endDate: DateTime
    initiaPrice: Money
    charity: String
    authenticityCertificate: Boolean
    gameWorn: Boolean
    autographed: Boolean
  }

  input CreateAuctionBidInput {
    id: String!
    user: BidParticipantUser!
    bid: Money!
  }

  extend type Mutation {
    createAuction(input: CreateAuctionInput!): Auction!
    updateAuction(id: String, input: EditAuctionInput): Auction!
    updateAuctionStatus(id: String!, status: AuctionStatus!): Auction!
    createAuctionBid(input: CreateAuctionBidInput!): Auction!
    addAuctionAttachment(id: String!, attachment: Upload!): Auction!
    deleteAuction(id: String!): AuctionStatusResponse!
  }
`;
