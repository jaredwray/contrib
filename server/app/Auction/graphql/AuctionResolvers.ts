import Dinero from 'dinero.js';

import { Auction } from '../dto/Auction';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionInput } from './model/AuctionInput';
import { ICreateAuctionBidInput } from './model/CreateAuctionBidInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requireInfluencer } from '../../../graphql/middleware/requireInfluencer';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { GraphqlResolver } from '../../../graphql/types';
import { AuctionAssets } from '../dto/AuctionAssets';
import { AuctionBid } from '../dto/AuctionBid';
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
    createAuctionBid: GraphqlResolver<AuctionBid, { id: string } & ICreateAuctionBidInput>;
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
    auction: loadInfluencer(async (_, { id }, { currentInfluencer, auction }) => {
      const foundAuction = await auction.getAuction(id);
      const isOwner = foundAuction?.auctionOrganizer?.id === currentInfluencer?.id;
      if (foundAuction?.status === AuctionStatus.DRAFT && !isOwner) {
        return null;
      }
      return foundAuction;
    }),
  },
  Mutation: {
    createAuction: requireInfluencer(async (_, input, { auction, currentInfluencer }) =>
      auction.createAuctionDraft(currentInfluencer?.id, input.input),
    ),
    updateAuction: requireInfluencer(async (_, { id, input }, { auction, currentInfluencer }) =>
      auction.updateAuction(id, currentInfluencer.id, input),
    ),
    deleteAuction: async () => Promise.resolve(null),
    addAuctionAttachment: requireInfluencer(async (_, { id, attachment }, { currentInfluencer, auction }) =>
      auction.addAuctionAttachment(id, currentInfluencer.id, attachment),
    ),
    removeAuctionAttachment: requireInfluencer(async (_, { id, attachmentUrl }, { currentInfluencer, auction }) =>
      auction.removeAuctionAttachment(id, currentInfluencer.id, attachmentUrl),
    ),
    createAuctionBid: requireAuthenticated(async (_, { id, bid }, { currentAccount, auction }) =>
      auction.addAuctionBid(id, { bid, user: currentAccount }),
    ),
    updateAuctionStatus: requireInfluencer(async (_, { id, status }, { auction, currentInfluencer }) =>
      auction.updateAuctionStatus(id, currentInfluencer.id, status),
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
