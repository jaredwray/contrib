import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { Auction } from '../dto/Auction';
import { AuctionOrderBy } from '../dto/AuctionOrderBy';
import { AuctionSearchFilters } from '../dto/AuctionSearchFilters';
import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionInput } from './model/AuctionInput';
import { ICreateAuctionBidInput } from './model/CreateAuctionBidInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { requirePermission } from '../../../graphql/middleware/requirePermission';
import { UserPermission } from '../../../authz';

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
    auctionPriceLimits: async (_: unknown, {}, { auction }: GraphqlContext) => auction.getAuctionPriceLimits(),
    sports: async (_: unknown, {}, { auction }: GraphqlContext) => auction.listSports(),
    auction: async (_: unknown, { id }: { id: string }, { auction }: GraphqlContext): Promise<Auction> => {
      return auction.getAuction(id);
    },
  },
  Mutation: {
    createAuction: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        input: { input: AuctionInput },
        { auction, user, userAccount, influencer }: GraphqlContext,
      ): Promise<any> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        const currentInfluencer = await influencer.findInfluencerByUserAccount(account.mongodbId);
        return auction.createAuctionDraft(currentInfluencer?.id, input.input);
      },
    ),
    updateAuction: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        { id, input }: { id: string; input: AuctionInput },
        { auction, user, userAccount, influencer }: GraphqlContext,
      ): Promise<any> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        const currentInfluencer = await influencer.findInfluencerByUserAccount(account.mongodbId);
        return auction.updateAuction(id, currentInfluencer?.id, input);
      },
    ),
    deleteAuction: async (_: unknown, input: { id: string }): Promise<any> => {
      return Promise.resolve(null);
    },
    addAuctionAttachment: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        { id, attachment }: { id: string; attachment: any },
        { user, userAccount, auction, influencer },
      ): Promise<any> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        const currentInfluencer = await influencer.findInfluencerByUserAccount(account.mongodbId);
        return auction.addAuctionAttachment(id, currentInfluencer?.id, attachment);
      },
    ),
    removeAuctionAttachment: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        { id, attachmentUrl }: { id: string; attachmentUrl: string },
        { user, userAccount, auction, influencer },
      ) => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        const currentInfluencer = await influencer.findInfluencerByUserAccount(account.mongodbId);
        return auction.removeAuctionAttachment(id, currentInfluencer?.id, attachmentUrl);
      },
    ),
    createAuctionBid: requireAuthenticated(
      async (parent: unknown, { id, bid }: { id: string } & ICreateAuctionBidInput, { user, auction, userAccount }) => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.addAuctionBid(id, { bid, user: account });
      },
    ),
    updateAuctionStatus: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        { id, status }: { id: string; status: AuctionStatus },
        { auction, user, userAccount, influencer }: GraphqlContext,
      ): Promise<Auction> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        const currentInfluencer = await influencer.findInfluencerByUserAccount(account.mongodbId);
        return auction.updateAuctionStatus(id, currentInfluencer?.id, status);
      },
    ),
  },
};
