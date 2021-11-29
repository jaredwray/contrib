import Dinero from 'dinero.js';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { GraphqlResolver } from '../../../graphql/types';

import { AuctionBid } from '../graphql/model/AuctionBid';

interface BidResolversType {
  Query: {
    bids: GraphqlResolver<AuctionBid[], { auctionId: string }>;
  };
}

export const BidResolvers: BidResolversType = {
  Query: {
    bids: requireAdmin(async (_, { auctionId }, { bidService }) => {
      const bids = await bidService.getPopulatedBids(auctionId);
      return bids.map((bid) => {
        return {
          user: {
            id: bid.user.authzId,
            mongodbId: bid.user._id.toString(),
            phoneNumber: bid.user.phoneNumber,
            stripeCustomerId: bid.user.stripeCustomerId,
            createdAt: bid.user.createdAt,
          },
          bid: Dinero({ amount: bid.bid, currency: bid.bidCurrency }),
          createdAt: bid.createdAt.toISOString(),
        };
      });
    }),
  },
};
