import { gql } from 'apollo-server-express';

export const BidSchema = gql`
  type AuctionBid {
    bid: Money!
    user: UserAccount
    auction: Auction
    createdAt: DateTime!
  }

  input BidsPageParams {
    skip: Int
    size: Int
  }

  type BidsPage {
    items: [AuctionBid]!
    totalItems: Int!
    size: Int
    skip: Int
  }

  extend type Query {
    bids(auctionId: String): [AuctionBid]
    myBids(params: BidsPageParams): BidsPage
    populatedBids(auctionId: String): [AuctionBid]
  }
`;
