import { gql } from 'apollo-server-express';

export const AuctionSchema = gql`
  type AuctionAttachments {
    assets: [String]!
    videos: [String]!
  }

  enum AuctionStatus {
    ACTIVE
    ACTIVE_BID
    SETTLED
  }

  type AuctionBid {
    user: UserAccount
    bid: Float!
  }

  type Auction {
    id: String!
    title: String!
    status: AuctionStatus!
    attachments: AuctionAttachments
    charities: [Charity!]!
    bids: [AuctionBid]
    maxBid: AuctionBid
    startDate: Date!
    initialPrice: String!
    endDate: Date!
  }

  extend type Query {
    auctions(size: Int!, skip: Int!): [Auction!]!
    auction(id: String!): Auction!
  }

  input AttachmentAuctionInput {
    videos: [Upload]
    assets: [Upload]
  }

  input CreateAuctionInput {
    title: String!
    startDate: Date!
    duration: String!
    attachments: AttachmentAuctionInput
  }

  input EditAuctionInput {
    attachments: AttachmentAuctionInput
  }

  input CreateAuctionBidInput {
    id: String!
    user: UserAccount
    bid: Float!
  }

  extend type Mutation {
    createAuction(input: CreateAuctionInput!): Auction!
    updateAuction(id: String, input: EditAuctionInput): Auction!
    createAuctionBid(input: CreateAuctionBidInput!): Auction!
  }
`;
