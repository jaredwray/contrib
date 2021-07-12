import Dinero from 'dinero.js';
import { Dayjs } from 'dayjs';

import { Auction } from '../dto/Auction';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionMetrics } from '../dto/AuctionMetrics';
import { AuctionInput } from './model/AuctionInput';
import { ChargeCurrentBidInput } from './model/ChargeCurrentBidInput';
import { ICreateAuctionBidInput } from './model/CreateAuctionBidInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requireRole } from '../../../graphql/middleware/requireRole';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { GraphqlResolver } from '../../../graphql/types';
import { AuctionAssets } from '../dto/AuctionAssets';
import { AuctionStatusResponse } from '../dto/AuctionStatusResponse';
import { loadRole } from '../../../graphql/middleware/loadRole';
import { AppError, ErrorCode } from '../../../errors';

interface AuctionResolversType {
  Query: {
    auctions: GraphqlResolver<
      { items: Auction[]; totalItems: number; size: number; skip: number },
      {
        size: number;
        skip: number;
        query?: string;
        filters?: AuctionSearchFilters;
        orderBy?: AuctionOrderBy;
        statusFilter: string[];
      }
    >;
    auctionPriceLimits: GraphqlResolver<
      { min: Dinero.Dinero; max: Dinero.Dinero },
      { filters?: AuctionSearchFilters; query?: string; statusFilter: string[] }
    >;
    sports: GraphqlResolver<string[]>;
    auction: GraphqlResolver<Auction, { id: string; organizerId?: string }>;
    getTotalRaisedAmount: GraphqlResolver<
      { totalRaisedAmount: Dinero.Dinero },
      { charityId: string; influencerId: string }
    >;
    getCustomerInformation: GraphqlResolver<{ phone: string; email: string } | null, { stripeCustomerId: string }>;
    getAuctionForAdminPage: GraphqlResolver<any, { id: string }>;
    getAuctionMetrics: GraphqlResolver<AuctionMetrics, { auctionId: string }>;
  };
  Mutation: {
    createAuction: GraphqlResolver<Auction, { input: AuctionInput }>;
    updateAuction: GraphqlResolver<Auction, { id: string; input: AuctionInput }>;
    deleteAuction: GraphqlResolver<{ id: string }, { id: string }>;
    addAuctionAttachment: GraphqlResolver<AuctionAssets, { id: string; attachment: any; organizerId: string }>;
    removeAuctionAttachment: GraphqlResolver<AuctionAssets, { id: string; attachmentUrl: string }>;
    createAuctionBid: GraphqlResolver<Auction, { id: string } & ICreateAuctionBidInput>;
    finishAuctionCreation: GraphqlResolver<Auction, { id: string }>;
    buyAuction: GraphqlResolver<AuctionStatusResponse, { id: string }>;
    stopAuction: GraphqlResolver<AuctionStatusResponse, { id: string }>;
    activateAuction: GraphqlResolver<AuctionStatusResponse, { id: string }>;
    chargeAuction: GraphqlResolver<{ id: string }, { id: string }>;
    chargeCurrendBid: GraphqlResolver<{ id: string }, { input: ChargeCurrentBidInput }>;
    followAuction: GraphqlResolver<{ user: string; createdAt: Dayjs } | null, { auctionId: string }>;
    unfollowAuction: GraphqlResolver<{ id: string } | null, { auctionId: string }>;
  };
  InfluencerProfile: {
    auctions: GraphqlResolver<Auction[], Record<string, never>, InfluencerProfile>;
  };
}

export const AuctionResolvers: AuctionResolversType = {
  Query: {
    auctions: async (_, { size, skip, query, filters, orderBy, statusFilter }, { auction }) =>
      auction.listAuctions({ query, filters, orderBy, size, skip, statusFilter }),
    auctionPriceLimits: (_, { filters, query, statusFilter }, { auction }) =>
      auction.getAuctionPriceLimits({ filters, query, statusFilter }),
    sports: (_, __, { auction }) => auction.listSports(),
    auction: loadRole(async (_, { id, organizerId }, { auction, currentAccount, currentInfluencerId }) => {
      const foundAuction = await auction.getAuction(id, organizerId);
      const isOwner = foundAuction?.auctionOrganizer?.id === currentInfluencerId;
      if (foundAuction?.status === AuctionStatus.DRAFT && !isOwner && !currentAccount.isAdmin) {
        return null;
      }
      return foundAuction;
    }),
    getTotalRaisedAmount: async (_, { charityId, influencerId }, { auction }) =>
      await auction.getTotalRaisedAmount(charityId, influencerId),
    getAuctionForAdminPage: requireAdmin(async (_, { id }, { auction }) => await auction.getAuctionForAdminPage(id)),
    getCustomerInformation: requireAdmin(
      async (_, { stripeCustomerId }, { auction }) => await auction.getCustomerInformation(stripeCustomerId),
    ),
    getAuctionMetrics: requireAdmin(
      async (_, { auctionId }, { auction }) => await auction.getAuctionMetrics(auctionId),
    ),
  },
  Mutation: {
    unfollowAuction: requireAuthenticated(async (_, { auctionId }, { auction, currentAccount }) =>
      auction.unfollowAuction(auctionId, currentAccount.mongodbId),
    ),
    followAuction: requireAuthenticated(async (_, { auctionId }, { auction, currentAccount }) =>
      auction.followAuction(auctionId, currentAccount.mongodbId),
    ),
    createAuction: requireRole(async (_, { input }, { auction, currentAccount, currentInfluencerId }) => {
      if (!input.organizerId || currentAccount.isAdmin || currentInfluencerId === input.organizerId) {
        return auction.createAuctionDraft(input.organizerId || currentInfluencerId, input);
      } else {
        return null;
      }
    }),
    chargeAuction: requireAdmin(async (_, { id }, { auction }) => {
      await auction.settleAndChargeCurrentAuction(id);
      return { id };
    }),
    chargeCurrendBid: requireAdmin(async (_, { input }, { auction }) => {
      await auction.chargeCurrendBid(input);
      return { id: input.charityId };
    }),
    updateAuction: requireRole(async (_, { id, input }, { auction, currentAccount, currentInfluencerId }) => {
      if (!currentAccount.isAdmin) {
        delete input.fairMarketValue;
      }
      return auction.updateAuction(
        id,
        currentAccount.isAdmin ? null : currentInfluencerId,
        input,
        currentAccount.isAdmin,
      );
    }),
    deleteAuction: requireRole(async (_, { id }, { auction, currentAccount, currentInfluencerId }) => {
      const foundAuction = await auction.getAuction(id);
      const isOwner = foundAuction?.auctionOrganizer?.id === currentInfluencerId;
      if (!currentAccount.isAdmin && !isOwner) {
        throw new AppError('Forbidden', ErrorCode.FORBIDDEN);
      }
      auction.deleteAuction(id);
      return { id };
    }),
    buyAuction: requireAuthenticated(async (_, { id }, { auction, currentAccount }) =>
      auction.buyAuction(id, currentAccount),
    ),
    stopAuction: requireAuthenticated(async (_, { id }, { auction }) => auction.stopAuction(id)),
    activateAuction: requireAuthenticated(async (_, { id }, { auction }) => auction.activateAuctionById(id)),
    addAuctionAttachment: requireRole(
      async (_, { id, attachment, organizerId }, { auction, currentAccount, currentInfluencerId }) =>
        auction.addAuctionAttachment(id, currentAccount.isAdmin ? organizerId : currentInfluencerId, attachment),
    ),
    removeAuctionAttachment: requireRole(
      async (_, { id, attachmentUrl }, { auction, currentAccount, currentInfluencerId }) =>
        auction.removeAuctionAttachment(id, currentAccount.isAdmin ? null : currentInfluencerId, attachmentUrl),
    ),
    createAuctionBid: requireAuthenticated(async (_, { id, bid }, { auction, currentAccount }) => {
      await auction.addAuctionBid(id, { bid, user: currentAccount });
      return auction.getAuction(id);
    }),
    finishAuctionCreation: requireRole(async (_, { id }, { auction, currentAccount, currentInfluencerId }) =>
      auction.maybeActivateAuction(id, currentAccount?.isAdmin ? null : currentInfluencerId),
    ),
  },
  InfluencerProfile: {
    auctions: loadRole(async (influencerProfile, _, { auction, currentAccount, currentInfluencerId }) => {
      const auctions = await auction.getInfluencersAuctions(currentInfluencerId);
      const isOwner = influencerProfile.id === currentInfluencerId;
      return auctions.filter((foundAuction) => foundAuction.status !== AuctionStatus.DRAFT || isOwner);
    }),
  },
};
