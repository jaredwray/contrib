import { gql } from 'apollo-server-express';

export const BidSchema = gql`
  type AuctionBid {
    bid: Money!
    user: UserAccount
    createdAt: String!
  }

  extend type Query {
    bids(auctionId: String): [AuctionBid]
    populatedBids(auctionId: String): [AuctionBid]
  }
`;
