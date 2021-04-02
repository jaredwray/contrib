import Dinero from 'dinero.js';

import { Auction } from '../dto/Auction';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionInput } from './model/AuctionInput';
import { ICreateAuctionBidInput } from './model/CreateAuctionBidInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requireRole } from '../../../graphql/middleware/requireRole';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { GraphqlResolver } from '../../../graphql/types';
import { AuctionAssets } from '../dto/AuctionAssets';
import { loadInfluencer } from '../../../graphql/middleware/loadInfluencer';

interface AuctionResolversType {
  Query: {
    auctions: GraphqlResolver<
      { items: Auction[]; totalItems: number; size: number; skip: number },
      { size: number; skip: number; query?: string; filters?: AuctionSearchFilters; orderBy?: AuctionOrderBy }
    >;
    auctionPriceLimits: GraphqlResolver<{ min: Dinero.Dinero; max: Dinero.Dinero }>;
    sports: GraphqlResolver<string[]>;
    auction: GraphqlResolver<Auction, { id: string }>;
  };
  Mutation: {
    createAuction: GraphqlResolver<Auction, { input: AuctionInput }>;
    updateAuction: GraphqlResolver<Auction, { id: string; input: AuctionInput }>;
    deleteAuction: GraphqlResolver<Auction, { id: string }>;
    addAuctionAttachment: GraphqlResolver<AuctionAssets, { id: string; attachment: any }>;
    removeAuctionAttachment: GraphqlResolver<AuctionAssets, { id: string; attachmentUrl: string }>;
    createAuctionBid: GraphqlResolver<Auction, { id: string } & ICreateAuctionBidInput>;
    updateAuctionStatus: GraphqlResolver<Auction, { id: string; status: AuctionStatus }>;
  };
  InfluencerProfile: {
    auctions: GraphqlResolver<Auction[], Record<string, never>, InfluencerProfile>;
  };
}

export const AuctionResolvers: AuctionResolversType = {
  Query: {
    auctions: async (_, { size, skip, query, filters, orderBy }, { auction }) =>
      auction.listAuctions({ query, filters, orderBy, size, skip }),
    auctionPriceLimits: (_, __, { auction }) => auction.getAuctionPriceLimits(),
    sports: (_, __, { auction }) => auction.listSports(),
    auction: loadInfluencer(async (_, { id }, { auction, currentAccount, currentInfluencer }) => {
      const foundAuction = await auction.getAuction(id);
      const isOwner = foundAuction?.auctionOrganizer?.id === currentInfluencer?.id;
      if (foundAuction?.status === AuctionStatus.DRAFT && !isOwner && !currentAccount.isAdmin) {
        return null;
      }
      return foundAuction;
    }),
  },
  Mutation: {
    createAuction: requireRole(async (_, { input }, { auction, currentAccount, currentInfluencer }) => {
      if (!input.organizerId || currentAccount.isAdmin || currentInfluencer?.id === input.organizerId) {
        return auction.createAuctionDraft(input.organizerId || currentInfluencer?.id, input);
      } else {
        return null;
      }
    }),
    updateAuction: requireRole(async (_, { id, input }, { auction, currentAccount, currentInfluencer }) =>
      auction.updateAuction(id, currentAccount.isAdmin ? null : currentInfluencer.id, input),
    ),
    deleteAuction: async () => Promise.resolve(null),
    addAuctionAttachment: requireRole(async (_, { id, attachment }, { auction, currentAccount, currentInfluencer }) =>
      auction.addAuctionAttachment(id, currentAccount.isAdmin ? null : currentInfluencer.id, attachment),
    ),
    removeAuctionAttachment: requireRole(
      async (_, { id, attachmentUrl }, { auction, currentAccount, currentInfluencer }) =>
        auction.removeAuctionAttachment(id, currentAccount.isAdmin ? null : currentInfluencer.id, attachmentUrl),
    ),
    createAuctionBid: requireAuthenticated(async (_, { id, bid }, { auction, currentAccount, currentInfluencer }) => {
      await auction.addAuctionBid(id, { bid, user: currentAccount });
      return auction.getAuction(id);
    }),
    updateAuctionStatus: requireRole(async (_, { id, status }, { auction, currentAccount, currentInfluencer }) =>
      auction.updateAuctionStatus(id, currentAccount?.isAdmin ? null : currentInfluencer?.id, status),
    ),
  },
  InfluencerProfile: {
    auctions: loadInfluencer(async (influencerProfile, _, { currentInfluencer, auction }) => {
      const auctions = await auction.getInfluencersAuctions(influencerProfile.id);
      const isOwner = influencerProfile.id === currentInfluencer?.id;
      return auctions.filter((foundAuction) => foundAuction.status !== AuctionStatus.DRAFT || isOwner);
    }),
  },
};
