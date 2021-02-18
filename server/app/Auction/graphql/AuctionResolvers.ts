type IAuctionAttachments = {
  videos: Blob[];
  assets: Blob[];
};

type ICreateAuctionInput = {
  title: string;
  startDate: Date;
  duration: string;
  attachments: IAuctionAttachments;
};

export const AuctionResolvers = {
  Query: {
    auctions: async (_: unknown, input: { size: number; skip: number }): Promise<any> => {
      return Promise.resolve(null);
    },
    auction: async (_: unknown, input: { id: string }): Promise<any> => {
      return Promise.resolve(null);
    },
  },
  Mutation: {
    createAuction: async (_: unknown, input: { input: ICreateAuctionInput }): Promise<any> => {
      return Promise.resolve(null);
    },
    updateAuction: async (_: unknown, input: { size: number; skip: number }): Promise<any> => {
      return Promise.resolve(null);
    },
    createAuctionBid: async (_: unknown, input: { size: number; skip: number }): Promise<any> => {
      return Promise.resolve(null);
    },
  },
};
