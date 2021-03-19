import { gql } from '@apollo/client';

export const MakeBid = gql`
  mutation createAuctionBid($id: String!, $bid: Money!) {
    createAuctionBid(id: $id, bid: $bid) {
      id
      bid
    }
  }
`;
