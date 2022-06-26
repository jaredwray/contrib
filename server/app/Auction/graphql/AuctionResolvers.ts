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
    auctions: async (_, { size, skip, query, filters, orderBy, statusFilter }, { auctionService }) =>
      auctionService.listAuctions({ query, filters, orderBy, size, skip, statusFilter }),
    getAuctionsForProfilePage: requireAuthenticated(async (_, __, { auctionService, currentAccount }) =>
      auctionService.getAuctionsForProfilePage(currentAccount.mongodbId),
    ),
    auctionPriceLimits: (_, { filters, query, statusFilter }, { auctionService }) =>
      auctionService.getAuctionPriceLimits({ filters, query, statusFilter }),
    auction: loadRole(async (_, { id, organizerId }, { auctionService, currentAccount, currentInfluencerIds }) => {
      const auction = await auctionService.getAuction(id, organizerId);
      if (!auction) return null;

      const isOwner = currentInfluencerIds?.includes(auction.auctionOrganizer.id);
      if (auction.status === AuctionStatus.DRAFT && !isOwner && !currentAccount?.isAdmin) return null;

      return auction;
    }),
    getCustomerInformation: requireAdmin(
      async (_, { stripeCustomerId }, { auctionService }) =>
        await auctionService.getCustomerInformation(stripeCustomerId),
    ),
    getAuctionMetrics: requireAuthenticated(
      async (_, { auctionId }, { auctionService }) => await auctionService.getAuctionMetrics(auctionId),
    ),
    calculateShippingCost: requireAuthenticated(
      async (_, { auctionId, deliveryMethod }, { auctionService, currentAccount }) =>
        await auctionService.calculateShippingCost(auctionId, deliveryMethod, currentAccount.mongodbId),
    ),
    getContentStorageAuthData: requireAuthenticated(
      async (_, __, { auctionService }) => await auctionService.getContentStorageAuthData(),
    ),
    totalRaisedAmount: async (_, {}, { auctionService }) => auctionService.getTotalRaisedAmount(),
  },
  Mutation: {
    updateOrCreateMetrics: (_, { shortLinkId, input }, { auctionService }) =>
      auctionService.updateOrCreateMetrics(shortLinkId, input),
    unfollowAuction: requireAuthenticated(
      async (_, { auctionId }, { auctionService, currentAccount }) =>
        await auctionService.unfollowAuction(auctionId, currentAccount.mongodbId),
    ),
    followAuction: requireAuthenticated(
      async (_, { auctionId }, { auctionService, currentAccount }) =>
        await auctionService.followAuction(auctionId, currentAccount.mongodbId),
    ),
    createAuction: requireRole(
      async (_, { input }, { auctionService, currentAccount, currentInfluencerId, currentInfluencerIds }) => {
        if (input.organizerId && !currentAccount.isAdmin && !currentInfluencerIds.includes(input.organizerId))
          throw new AppError('Forbidden', ErrorCode.FORBIDDEN);

        return auctionService.createDraftAuction(
          input.organizerId || currentInfluencerId,
          input,
          currentAccount.isAdmin,
        );
      },
    ),
    chargeAuction: requireAdmin(async (_, { id }, { auctionService }) => {
      await auctionService.settleAndChargeCurrentAuction(id);
      return { id };
    }),
    chargeCurrendBid: requireAdmin(async (_, { input }, { auctionService }) => {
      await auctionService.chargeCurrendBid(input);
      return { id: input.charityId };
    }),
    updateAuction: requireRole(async (_, { id, input }, { auctionService, currentAccount, currentInfluencerId }) => {
      return auctionService.updateAuction(
        id,
        currentAccount.isAdmin ? null : currentInfluencerId,
        input,
        currentAccount.isAdmin,
      );
    }),
    deleteAuction: requireRole(async (_, { id }, { auctionService, currentAccount, currentInfluencerIds }) => {
      const auction = await auctionService.getAuction(id);
      const isOwner = currentInfluencerIds.includes(auction?.auctionOrganizer?.id);
      if (!currentAccount.isAdmin && !isOwner) throw new AppError('Forbidden', ErrorCode.FORBIDDEN);

      auctionService.deleteAuction(id);
      return { id };
    }),
    buyAuction: requireAuthenticated(async (_, { id }, { auctionService, currentAccount }) => {
      const auction = await auctionService.buyAuction(id, currentAccount);
      pubSub.publish(AuctionSubscriptions.AUCTION_UPDATE, { auction });
      return auction;
    }),
    stopAuction: requireAuthenticated(async (_, { id }, { auctionService }) => {
      const auction = await auctionService.stopAuction(id);
      pubSub.publish(AuctionSubscriptions.AUCTION_UPDATE, { auction });
      return auction;
    }),
    activateAuction: requireAuthenticated(async (_, { id }, { auctionService }) => {
      const auction = await auctionService.activateAuctionById(id);
      pubSub.publish(AuctionSubscriptions.AUCTION_UPDATE, { auction });
      return auction;
    }),
    addAuctionAttachment: requireRole(
      async (_, { id, input }, { auctionService, currentAccount, currentInfluencerId }) =>
        auctionService.addAuctionAttachment(id, currentAccount.isAdmin ? null : currentInfluencerId, input),
    ),
    deleteAuctionAttachment: requireRole(
      async (_, { auctionId, attachmentId }, { auctionService, currentAccount, currentInfluencerId }) =>
        auctionService.deleteAuctionAttachment(
          auctionId,
          currentAccount.isAdmin ? null : currentInfluencerId,
          attachmentId,
        ),
    ),
    createAuctionBid: requireAuthenticated(async (_, { id, bid }, { auctionService, currentAccount }) => {
      await auctionService.addAuctionBid(id, { bid, user: currentAccount });
      const auction = await auctionService.getAuction(id);
      pubSub.publish(AuctionSubscriptions.NEW_BID, { auction });

      return auction;
    }),
    finishAuctionCreation: requireRole(async (_, { id }, { auctionService, currentAccount, currentInfluencerId }) =>
      auctionService.maybeActivateAuction(id, currentAccount.isAdmin ? null : currentInfluencerId),
    ),
    updateAuctionParcel: requireAdmin(
      async (_, { auctionId, input }, { auctionService }) => await auctionService.updateAuctionParcel(auctionId, input),
    ),
    shippingRegistration: requireAuthenticated(
      async (_, { input }, { auctionService, currentAccount }) =>
        await auctionService.shippingRegistration(input, currentAccount.mongodbId),
    ),
  },
  Subscription: {
    auction: {
      subscribe: () => pubSub.asyncIterator([AuctionSubscriptions.AUCTION_UPDATE, AuctionSubscriptions.NEW_BID]),
    },
  },
  InfluencerProfile: {
    auctions: loadRole(async (influencerProfile, _, { auctionService, currentInfluencerId, currentInfluencerIds }) => {
      const auctions = await auctionService.getInfluencersAuctions(currentInfluencerId);
      const isOwner = currentInfluencerIds.includes(influencerProfile.id);
      return auctions.filter((foundAuction) => foundAuction.status !== AuctionStatus.DRAFT || isOwner);
    }),
  },
};
