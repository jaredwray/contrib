import { gql } from 'apollo-server-express';

export const AuctionSchema = gql`
  type AuctionAttachment {
    id: String!
    type: String!
    url: String!
    uid: String
    cloudflareUrl: String
    thumbnail: String
    originalFileName: String
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
    endDate: DateTime!
    auctionOrganizer: InfluencerProfile!
    totalBids: Int!
    link: String!
    fairMarketValue: Money
  }

  input AuctionSearchFilters {
    sports: [String]
    minPrice: Int
    maxPrice: Int
    status: [String]
    auctionOrganizer: String
  }

  enum AuctionOrderBy {
    CREATED_AT_DESC
    TIME_ASC
    TIME_DESC
    SPORT
    PRICE_ASC
    PRICE_DESC
  }

  type AuctionsPage {
    items: [Auction]!
    totalItems: Int!
    size: Int
    skip: Int
  }

  type AuctionPriceLimits {
    max: Money!
    min: Money!
  }

  extend type Query {
    auctions(size: Int, skip: Int, query: String, filters: AuctionSearchFilters, orderBy: String): AuctionsPage!
    auctionPriceLimits: AuctionPriceLimits!
    auction(id: String!): Auction
    sports: [String]
  }

  input AuctionInput {
    organizerId: String
    title: String
    description: String
    fullPageDescription: String
    startDate: DateTime
    endDate: DateTime
    startPrice: Money
    charity: String
    authenticityCertificate: Boolean
    gameWorn: Boolean
    autographed: Boolean
    sport: String
    playedIn: String
    fairMarketValue: Money
  }

  extend type Mutation {
    createAuction(input: AuctionInput!): Auction!
    updateAuction(id: String, input: AuctionInput): Auction!
    updateAuctionStatus(id: String!, status: AuctionStatus!): Auction!
    createAuctionBid(id: String!, bid: Money!): Auction!
    addAuctionAttachment(id: String!, attachment: Upload!): AuctionAttachment!
    removeAuctionAttachment(id: String!, attachmentUrl: String!): AuctionAttachment!
    deleteAuction(id: String!): AuctionStatusResponse!
  }

  extend type InfluencerProfile {
    auctions: [Auction!]
  }
`;
