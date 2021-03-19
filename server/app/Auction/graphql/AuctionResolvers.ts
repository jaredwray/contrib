import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { Auction } from '../dto/Auction';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionInput } from './model/AuctionInput';
import { ICreateAuctionBidInput } from './model/CreateAuctionBidInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requireInfluencer } from '../../../graphql/middleware/requireInfluencer';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';

export const AuctionResolvers = {
  Query: {
    auctions: async (
      _: unknown,
      {
        size,
        skip,
        query,
        filters,
        orderBy,
      }: {
        size: number;
        skip: number;
        query?: string;
        filters?: AuctionSearchFilters;
        orderBy?: AuctionOrderBy;
      },
      { auction }: GraphqlContext,
    ): Promise<{ items: Auction[]; totalItems: number; size: number; skip: number }> => {
      return await auction.listAuctions({ query, filters, orderBy, size, skip });
    },
    auctionPriceLimits: (_: unknown, __: unknown, { auction }: GraphqlContext) => auction.getAuctionPriceLimits(),
    sports: (_: unknown, __: unknown, { auction }: GraphqlContext) => auction.listSports(),
    auction: (_: unknown, { id }: { id: string }, { auction }: GraphqlContext): Promise<Auction> =>
      auction.getAuction(id),
  },
  Mutation: {
    createAuction: requireInfluencer(
      async (
        _: unknown,
        input: { input: AuctionInput },
        { auction, currentInfluencer }: GraphqlContext,
      ): Promise<any> => auction.createAuctionDraft(currentInfluencer?.id, input.input),
    ),
    updateAuction: requireInfluencer(
      async (
        _: unknown,
        { id, input }: { id: string; input: AuctionInput },
        { auction, currentInfluencer }: GraphqlContext,
      ): Promise<any> => auction.updateAuction(id, currentInfluencer.id, input),
    ),
    deleteAuction: async (_: unknown, input: { id: string }): Promise<any> => {
      return Promise.resolve(null);
    },
    addAuctionAttachment: requireInfluencer(
      async (
        _: unknown,
        { id, attachment }: { id: string; attachment: any },
        { currentInfluencer, auction },
      ): Promise<any> => auction.addAuctionAttachment(id, currentInfluencer.id, attachment),
    ),
    removeAuctionAttachment: requireInfluencer(
      async (
        _: unknown,
        { id, attachmentUrl }: { id: string; attachmentUrl: string },
        { currentInfluencer, auction },
      ) => auction.removeAuctionAttachment(id, currentInfluencer.id, attachmentUrl),
    ),
    createAuctionBid: requireAuthenticated(
      async (parent: unknown, { id, bid }: { id: string } & ICreateAuctionBidInput, { user, auction, userAccount }) => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.addAuctionBid(id, { bid, user: account });
      },
    ),
    updateAuctionStatus: requireInfluencer(
      async (
        _: unknown,
        { id, status }: { id: string; status: AuctionStatus },
        { auction, currentInfluencer }: GraphqlContext,
      ): Promise<Auction> => auction.updateAuctionStatus(id, currentInfluencer.id, status),
    ),
  },
  InfluencerProfile: {
    auctions: async (parent: InfluencerProfile, _, { auction }: GraphqlContext): Promise<Auction[]> =>
      await auction.getInfluencersAuctions(parent.id),
  },
};
