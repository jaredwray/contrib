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
    PENDING
    ACTIVE
    SETTLED
  }

  type AuctionStatusResponse {
    status: String!
  }

  type AuctionBid {
    bid: Money!
    createdAt: DateTime!
  }

  type TotalRaisedAmount {
    totalRaisedAmount: Money!
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
    currentPrice: Money!
    charity: Charity
    gameWorn: Boolean!
    autographed: Boolean!
    authenticityCertificate: Boolean!
    sport: String!
    startDate: DateTime!
    endDate: DateTime!
    auctionOrganizer: InfluencerProfile!
    totalBids: Int!
    link: String!
    fairMarketValue: Money
    timeZone: String
  }

  input AuctionSearchFilters {
    sports: [String]
    minPrice: Int
    maxPrice: Int
    status: [String]
    auctionOrganizer: String
    charity: String
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
    getTotalRaisedAmount(charityId: String, influencerId: String): TotalRaisedAmount!
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
    timeZone: String
  }

  extend type Mutation {
    createAuction(input: AuctionInput!): Auction!
    updateAuction(id: String, input: AuctionInput): Auction!
    finishAuctionCreation(id: String!): Auction!
    createAuctionBid(id: String!, bid: Money!): Auction!
    addAuctionAttachment(id: String!, attachment: Upload!, organizerId: String): AuctionAttachment!
    removeAuctionAttachment(id: String!, attachmentUrl: String!): AuctionAttachment!
    deleteAuction(id: String!): AuctionStatusResponse!
  }

  extend type InfluencerProfile {
    auctions: [Auction!]
  }
`;
