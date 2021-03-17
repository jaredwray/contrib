import { FC } from 'react';

import MultiCarousel from 'src/components/MultiCarousel';
import { Auction } from 'src/types/Auction';

import AuctionPreview from './AuctionPreview';

interface Props {
  auctions: Auction[];
}

const AuctionsCarousel: FC<Props> = ({ auctions }) => {
  const items = [...Array(10)].map((e: number, i: number) => <AuctionPreview key={i} auction={null} />);

  return <MultiCarousel items={items} />;
};

export default AuctionsCarousel;
