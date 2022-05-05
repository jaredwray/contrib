import Dinero from 'dinero.js';
import { Dayjs } from 'dayjs';
import { PubSub } from 'graphql-subscriptions';

import { Auction } from '../dto/Auction';
import { AuctionsForProfilePage } from '../dto/AuctionsForProfilePage';
import { AuctionSubscriptions } from '../dto/AuctionSubscriptions';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionMetrics } from '../dto/AuctionMetrics';
import { AuctionParcel } from '../dto/AuctionParcel';
import { AuctionAssets } from '../dto/AuctionAssets';
import { AuctionAttachmentInput } from './model/AuctionAttachmentInput';
import { AuctionInput } from './model/AuctionInput';
import { ChargeCurrentBidInput } from './model/ChargeCurrentBidInput';
import { ICreateAuctionBidInput } from './model/CreateAuctionBidInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requireRole } from '../../../graphql/middleware/requireRole';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { GraphqlResolver, GraphqlSubscription } from '../../../graphql/types';
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
    getAuctionsForProfilePage: GraphqlResolver<AuctionsForProfilePage | null>;
    auctionPriceLimits: GraphqlResolver<
      { min: Dinero.Dinero; max: Dinero.Dinero },
      { filters?: AuctionSearchFilters; query?: string; statusFilter: string[] }
    >;
    auction: GraphqlResolver<Auction, { id: string; organizerId?: string }>;
    getCustomerInformation: GraphqlResolver<{ phone: string; email: string } | null, { stripeCustomerId: string }>;
    getAuctionMetrics: GraphqlResolver<AuctionMetrics | {}, { auctionId: string }>;
    calculateShippingCost: GraphqlResolver<
      { deliveryPrice: Dinero.Dinero; timeInTransit: Dayjs },
      { auctionId: string; deliveryMethod: string }
    >;
    getContentStorageAuthData: GraphqlResolver<{ authToken: string; accountId: string }, void>;
    totalRaisedAmount: GraphqlResolver<number>;
  };
  Mutation: {
    updateOrCreateMetrics: GraphqlResolver<
      { id: string } | null,
      { shortLinkId: string; input: { country: string; referrer: string; userAgentData: string } }
    >;
    createAuction: GraphqlResolver<Auction, { input: AuctionInput }>;
    updateAuction: GraphqlResolver<Auction, { id: string; input: AuctionInput }>;
    deleteAuction: GraphqlResolver<{ id: string }, { id: string }>;
    addAuctionAttachment: GraphqlResolver<AuctionAssets, { id: string; input: AuctionAttachmentInput }>;
    deleteAuctionAttachment: GraphqlResolver<AuctionAssets, { auctionId: string; attachmentId: string }>;
    createAuctionBid: GraphqlResolver<Auction, { id: string } & ICreateAuctionBidInput>;
    finishAuctionCreation: GraphqlResolver<Auction, { id: string }>;
    buyAuction: GraphqlResolver<Auction, { id: string }>;
    stopAuction: GraphqlResolver<Auction, { id: string }>;
    activateAuction: GraphqlResolver<Auction, { id: string }>;
    chargeAuction: GraphqlResolver<{ id: string }, { id: string }>;
    chargeCurrendBid: GraphqlResolver<{ id: string }, { input: ChargeCurrentBidInput }>;
    followAuction: GraphqlResolver<{ user: string; createdAt: Dayjs } | null, { auctionId: string }>;
    unfollowAuction: GraphqlResolver<{ id: string } | null, { auctionId: string }>;
    updateAuctionParcel: GraphqlResolver<AuctionParcel, { auctionId: string; input: AuctionParcel }>;
    shippingRegistration: GraphqlResolver<
      { deliveryPrice: Dinero.Dinero; identificationNumber: string },
      { input: { auctionId: string; deliveryMethod: string; timeInTransit: Dayjs; auctionWinnerId: string } }
    >;
  };
  Subscription: {
    auction: GraphqlSubscription;
  };
  InfluencerProfile: {
    auctions: GraphqlResolver<Auction[], Record<string, never>, InfluencerProfile>;
  };
}

const pubSub = new PubSub();

export const AuctionResolvers: AuctionResolversType = {
  Query: {
    auctions: async (_, { size, skip, query, filters, orderBy, statusFilter }, { auction }) =>
      auction.listAuctions({ query, filters, orderBy, size, skip, statusFilter }),
    getAuctionsForProfilePage: requireAuthenticated(async (_, __, { auction, currentAccount }) =>
      auction.getAuctionsForProfilePage(currentAccount.mongodbId),
    ),
    auctionPriceLimits: (_, { filters, query, statusFilter }, { auction }) =>
      auction.getAuctionPriceLimits({ filters, query, statusFilter }),
    auction: loadRole(async (_, { id, organizerId }, { auction, currentAccount, currentInfluencerId }) => {
      const foundAuction = await auction.getAuction(id, organizerId);
      const isOwner = foundAuction?.auctionOrganizer?.id === currentInfluencerId;
      if (foundAuction?.status === AuctionStatus.DRAFT && !isOwner && !currentAccount?.isAdmin) {
        return null;
      }
      return foundAuction;
    }),
    getCustomerInformation: requireAdmin(
      async (_, { stripeCustomerId }, { auction }) => await auction.getCustomerInformation(stripeCustomerId),
    ),
    getAuctionMetrics: requireAuthenticated(
      async (_, { auctionId }, { auction }) => await auction.getAuctionMetrics(auctionId),
    ),
    calculateShippingCost: requireAuthenticated(
      async (_, { auctionId, deliveryMethod }, { auction, currentAccount }) =>
        await auction.calculateShippingCost(auctionId, deliveryMethod, currentAccount.mongodbId),
    ),
    getContentStorageAuthData: requireAuthenticated(
      async (_, __, { auction }) => await auction.getContentStorageAuthData(),
    ),
    totalRaisedAmount: async (_, {}, { auction }) => auction.getTotalRaisedAmount(),
  },
  Mutation: {
    updateOrCreateMetrics: (_, { shortLinkId, input }, { auction }) =>
      auction.updateOrCreateMetrics(shortLinkId, input),
    unfollowAuction: requireAuthenticated(
      async (_, { auctionId }, { auction, currentAccount }) =>
        await auction.unfollowAuction(auctionId, currentAccount.mongodbId),
    ),
    followAuction: requireAuthenticated(
      async (_, { auctionId }, { auction, currentAccount }) =>
        await auction.followAuction(auctionId, currentAccount.mongodbId),
    ),
    createAuction: requireRole(async (_, { input }, { auction, currentAccount, currentInfluencerId }) => {
      if (!input.organizerId || currentAccount.isAdmin || currentInfluencerId === input.organizerId) {
        return auction.createDraftAuction(input.organizerId || currentInfluencerId, input, currentAccount.isAdmin);
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
    buyAuction: requireAuthenticated(async (_, { id }, { auction, currentAccount }) => {
      const auctionUpdates = await auction.buyAuction(id, currentAccount);
      pubSub.publish(AuctionSubscriptions.AUCTION_UPDATE, { auction: auctionUpdates });
      return auctionUpdates;
    }),
    stopAuction: requireAuthenticated(async (_, { id }, { auction }) => {
      const auctionUpdates = await auction.stopAuction(id);
      pubSub.publish(AuctionSubscriptions.AUCTION_UPDATE, { auction: auctionUpdates });
      return auctionUpdates;
    }),
    activateAuction: requireAuthenticated(async (_, { id }, { auction }) => {
      const auctionUpdates = await auction.activateAuctionById(id);
      pubSub.publish(AuctionSubscriptions.AUCTION_UPDATE, { auction: auctionUpdates });
      return auctionUpdates;
    }),
    addAuctionAttachment: requireRole(async (_, { id, input }, { auction, currentAccount, currentInfluencerId }) =>
      auction.addAuctionAttachment(id, currentAccount.isAdmin ? null : currentInfluencerId, input),
    ),
    deleteAuctionAttachment: requireRole(
      async (_, { auctionId, attachmentId }, { auction, currentAccount, currentInfluencerId }) =>
        auction.deleteAuctionAttachment(auctionId, currentAccount.isAdmin ? null : currentInfluencerId, attachmentId),
    ),
    createAuctionBid: requireAuthenticated(async (_, { id, bid }, { auction, currentAccount }) => {
      await auction.addAuctionBid(id, { bid, user: currentAccount });
      const currentAuction = await auction.getAuction(id);
      pubSub.publish(AuctionSubscriptions.NEW_BID, { auction: currentAuction });
      return currentAuction;
    }),
    finishAuctionCreation: requireRole(async (_, { id }, { auction, currentAccount, currentInfluencerId }) =>
      auction.maybeActivateAuction(id, currentAccount.isAdmin ? null : currentInfluencerId),
    ),
    updateAuctionParcel: requireAdmin(
      async (_, { auctionId, input }, { auction }) => await auction.updateAuctionParcel(auctionId, input),
    ),
    shippingRegistration: requireAuthenticated(
      async (_, { input }, { auction, currentAccount }) =>
        await auction.shippingRegistration(input, currentAccount.mongodbId),
    ),
  },
  Subscription: {
    auction: {
      subscribe: () => pubSub.asyncIterator([AuctionSubscriptions.AUCTION_UPDATE, AuctionSubscriptions.NEW_BID]),
    },
  },
  InfluencerProfile: {
    auctions: loadRole(async (influencerProfile, _, { auction, currentInfluencerId }) => {
      const auctions = await auction.getInfluencersAuctions(currentInfluencerId);
      const isOwner = influencerProfile.id === currentInfluencerId;
      return auctions.filter((foundAuction) => foundAuction.status !== AuctionStatus.DRAFT || isOwner);
    }),
  },
};
