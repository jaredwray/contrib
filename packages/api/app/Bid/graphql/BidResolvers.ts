import Dinero from 'dinero.js';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { GraphqlResolver } from '../../../graphql/types';
import { Bid } from '../dto/Bid';
import { BidsPage, BidsPageParams } from '../dto/BidsPage';

interface BidResolversType {
  Query: {
    bids: GraphqlResolver<Bid[], { auctionId: string }>;
    myBids: GraphqlResolver<BidsPage, { params: BidsPageParams }>;
    populatedBids: GraphqlResolver<Bid[], { auctionId: string }>;
  };
}

export const BidResolvers: BidResolversType = {
  Query: {
    bids: async (_, { auctionId }, { bidService }) => bidService.bids(auctionId),
    myBids: requireAuthenticated(async (_, { params }, { bidService, currentAccount }) =>
      bidService.userBids(currentAccount.mongodbId, params),
    ),
    populatedBids: requireAdmin(async (_, { auctionId }, { bidService }) => bidService.populatedBids(auctionId)),
  },
};
