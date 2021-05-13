import { FC, useMemo } from 'react';

import Dinero from 'dinero.js';

import { AuctionStatus, Auction } from 'src/types/Auction';

interface Props {
  auctions: Auction[];
}
export const TotalRaisedAmount: FC<Props> = ({ auctions }) => {
  const totalRaised = useMemo(
    () =>
      (auctions ?? [])
        .filter((a: Auction) => a.status === AuctionStatus.SETTLED)
        .map((a: Auction) => Dinero(a.maxBid?.bid))
        .reduce((total: any, next: any) => total.add(next), Dinero({ amount: 0, currency: 'USD' })),
    [auctions],
  );

  return <p className="text-label text-all-cups">Total amount raised: {totalRaised.toFormat('$0,0')}</p>;
};
