import { FC, ReactElement } from 'react';

import Slider from 'src/components/Slider';
import { Auction } from 'src/types/Auction';

import AuctionPreview from './AuctionPreview';

interface Props {
  auctions: Auction[];
}

const AuctionsSlider: FC<Props> = ({ auctions }): ReactElement => {
  const items = auctions.map((auction: Auction, i: number) => <AuctionPreview key={i} auction={auction} />);

  return <Slider items={items} />;
};

export default AuctionsSlider;
