import { gql } from '@apollo/client';

export const AuctionPriceLimitsQuery = gql`
  query auctionPriceLimits {
    auctionPriceLimits {
      max
      min
    }
  }
`;

export const AuctionsListQuery = gql`
  query auctions($size: Int!, $skip: Int!, $query: String, $orderBy: String, $filters: AuctionSearchFilters) {
    auctions(size: $size, skip: $skip, query: $query, orderBy: $orderBy, filters: $filters) {
      totalItems
      size
      skip
      items {
        id
        title
        description
        endDate
      }
    }
  }
`;

export const SportsQuery = gql`
  query sports {
    sports
  }
`;
