import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { Auction } from '../dto/Auction';
import { AuctionStatus } from '../dto/AuctionStatus';
import { ICreateAuctionInput } from './model/CreateAuctionInput';
import { IUpdateAuctionInput } from './model/UpdateAuctionInput';
import { ICreateAuctionBidInput } from './model/CreateAuctionBidInput';

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
    createAuction: async (
      _: unknown,
      input: { input: ICreateAuctionInput },
      { auction }: GraphqlContext,
    ): Promise<any> => {
      return auction.createAuctionDraft(input.input);
    },
    updateAuction: async (
      _: unknown,
      { id, input }: { id: string; input: IUpdateAuctionInput },
      { auction }: GraphqlContext,
    ): Promise<any> => {
      return auction.updateAuction(id, input);
    },
    deleteAuction: async (_: unknown, input: { id: string }): Promise<any> => {
      return Promise.resolve(null);
    },
    addAuctionAttachment: async (_: unknown, input: { id: string; attachment: any }): Promise<any> => {
      return Promise.resolve(null);
    },
    createAuctionBid: async (_: unknown, input: { input: ICreateAuctionBidInput }): Promise<any> => {
      return Promise.resolve(null);
    },
    updateAuctionStatus: async (
      _: unknown,
      { id, status }: { id: string; status: AuctionStatus },
      { auction }: GraphqlContext,
    ): Promise<Auction> => {
      return auction.updateAuctionStatus(id, status);
    },
  },
};
