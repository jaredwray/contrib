import { FC } from 'react';

import { useQuery } from '@apollo/client';

import { GetAuctionsForProfilePageQuery } from 'src/apollo/queries/userProfile';
import AuctionCard from 'src/components/custom/AuctionCard';
import { Auction } from 'src/types/Auction';

import Сarousel from './Carousel';

const Auctions: FC = () => {
  const { data, loading } = useQuery(GetAuctionsForProfilePageQuery);
  const auctions = data?.getAuctionsForProfilePage || { live: [], won: [] };
  const liveAuctions = auctions?.live?.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction} />);
  const wonAuctions = auctions?.won?.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction} />);

  return (
    <>
      <Сarousel
        auctions={liveAuctions}
        emptyText="No live auctions with your bids."
        loading={loading}
        title="Live Auctions with my bids"
      />
      <Сarousel
        auctions={wonAuctions}
        emptyText="No auctions where you won."
        loading={loading}
        title="Auctions where i won"
      />
    </>
  );
};

export default Auctions;
