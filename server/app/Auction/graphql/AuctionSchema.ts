import { gql } from 'apollo-server-express';

export const AuctionSchema = gql`
  enum AuctionStatus {
    DRAFT
    PENDING
    ACTIVE
    SETTLED
    FAILED
    SOLD
    STOPPED
  }

  enum AuctionOrderBy {
    CREATED_AT_DESC
    TIME_ASC
    TIME_DESC
    SPORT
    PRICE_ASC
    PRICE_DESC
  }

  type AuctionAttachment {
    id: String!
    type: String!
    url: String!
    uid: String
    cloudflareUrl: String
    thumbnail: String
    originalFileName: String
  }

  type AuctionStatusResponse {
    status: String!
  }

  type AuctionBid {
    bid: Money!
    createdAt: DateTime!
    user: String!
    paymentSource: String!
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
    itemPrice: Money
    currentPrice: Money!
    charity: Charity
    gameWorn: Boolean!
    autographed: Boolean!
    authenticityCertificate: Boolean!
    sport: String!
    startDate: DateTime!
    endDate: DateTime!
    stoppedAt: DateTime
    auctionOrganizer: InfluencerProfile!
    totalBids: Int!
    link: String!
    fairMarketValue: Money
    timeZone: String
    followers: [Follow]
    isActive: Boolean!
    isDraft: Boolean!
    isPending: Boolean!
    isSettled: Boolean!
    isFailed: Boolean!
    isSold: Boolean!
    isStopped: Boolean!
  }

  type AuctionForAdminPage {
    id: String!
    title: String!
    status: AuctionStatus
    startDate: DateTime!
    endDate: DateTime!
    timeZone: String
    charity: AuctionCharity
    bids: [AuctionAdminBid]
    currentPrice: Money!
    startPrice: Money!
    fairMarketValue: Money
    auctionOrganizer: AuctionAdminOrganizer
    isFailed: Boolean!
    isSold: Boolean!
    link: String!
    bitly: Metrics
  }
  type Metrics {
    clicks: [Clicks]
    clicksByDay: [Clicks]
    referrers: [Referrers]
    countries: [Countries]
  }
  type Clicks {
    date: String
    clicks: String
  }
  type Referrers {
    value: String
    clicks: String
  }
  type Countries {
    value: String
    clicks: String
  }
  type AuctionAdminOrganizer {
    id: String!
    name: String!
  }

  type AuctionCharity {
    id: String!
    name: String!
    stripeAccountId: String!
  }

  type AuctionAdminBid {
    bid: Money!
    user: AuctionUser
    paymentSource: String!
    createdAt: String!
  }

  type AuctionUser {
    id: String!
    mongodbId: String!
    phoneNumber: String!
    status: UserAccountStatus
    stripeCustomerId: String!
    createdAt: String!
  }

  type ResponceId {
    id: String!
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

  type CustomerInformation {
    email: String
    phone: String
  }

  input AuctionSearchFilters {
    sports: [String]
    minPrice: Int
    maxPrice: Int
    status: [String]
    auctionOrganizer: String
    charity: String
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
    itemPrice: Money
  }

  input CurrentAuctionBid {
    charityId: String
    charityStripeAccountId: String!
    auctionTitle: String
    paymentSource: String
    bid: Money
    user: AuctionInputUser
  }

  input AuctionInputUser {
    id: String!
    mongodbId: String!
    phoneNumber: String!
    status: UserAccountStatus
    stripeCustomerId: String!
    createdAt: String!
  }

  extend type Query {
    auctions(
      size: Int
      skip: Int
      query: String
      filters: AuctionSearchFilters
      orderBy: String
      statusFilter: [String]
    ): AuctionsPage!
    auctionPriceLimits(query: String, filters: AuctionSearchFilters, statusFilter: [String]): AuctionPriceLimits!
    auction(id: String!): Auction
    sports: [String]
    getTotalRaisedAmount(charityId: String, influencerId: String): TotalRaisedAmount!
    getAuctionForAdminPage(id: String!): AuctionForAdminPage
    getCustomerInformation(stripeCustomerId: String!): CustomerInformation
  }

  extend type Mutation {
    createAuction(input: AuctionInput!): Auction!
    updateAuction(id: String, input: AuctionInput): Auction!
    finishAuctionCreation(id: String!): Auction!
    buyAuction(id: String): AuctionStatusResponse!
    stopAuction(id: String): AuctionStatusResponse!
    activateAuction(id: String): AuctionStatusResponse!
    createAuctionBid(id: String!, bid: Money!): Auction!
    addAuctionAttachment(id: String!, attachment: Upload!, organizerId: String): AuctionAttachment!
    removeAuctionAttachment(id: String!, attachmentUrl: String!): AuctionAttachment!
    deleteAuction(id: String!): ResponceId!
    chargeAuction(id: String!): ResponceId!
    chargeCurrendBid(input: CurrentAuctionBid!): ResponceId!
    followAuction(auctionId: String!): Follow
    unfollowAuction(auctionId: String!): ResponceId
  }

  extend type InfluencerProfile {
    auctions: [Auction!]
  }
`;
