import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { Auction } from '../dto/Auction';
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
      { size, skip }: { size: number; skip: number },
      { auction }: GraphqlContext,
    ): Promise<any> => {
      return auction.listAuctions(skip, size);
    },
    auction: async (_: unknown, { id }: { id: string }, { auction }: GraphqlContext): Promise<any> => {
      return auction.getAuction(id);
    },
  },
  Mutation: {
    createAuction: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        input: { input: AuctionInput },
        { auction, user, userAccount }: GraphqlContext,
      ): Promise<any> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.createAuctionDraft(account.mongodbId, input.input);
      },
    ),
    updateAuction: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        { id, input }: { id: string; input: AuctionInput },
        { auction, user, userAccount }: GraphqlContext,
      ): Promise<any> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.updateAuction(id, account.mongodbId, input);
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
        { user, userAccount, auction },
      ): Promise<any> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.addAuctionAttachment(id, account.mongodbId, attachment);
      },
    ),
    removeAuctionAttachment: requirePermission(
      UserPermission.INFLUENCER,
      async (
        _: unknown,
        { id, attachmentUrl }: { id: string; attachmentUrl: string },
        { user, userAccount, auction },
      ) => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.removeAuctionAttachment(id, account.mongodbId, attachmentUrl);
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
        { auction, user, userAccount }: GraphqlContext,
      ): Promise<Auction> => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return auction.updateAuctionStatus(id, account.mongodbId, status);
      },
    ),
  },
};
