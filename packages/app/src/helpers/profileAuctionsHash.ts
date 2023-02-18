import { AuctionStatus, Auction } from 'src/types/Auction';

export const profileAuctionsHash = (auctions: Auction[]) => {
  return Object.keys(AuctionStatus).reduce((hash: any, elem: string) => {
    hash[elem] = (auctions ?? []).filter((a: Auction) => a.status === elem);

    return hash;
  }, {});
};
