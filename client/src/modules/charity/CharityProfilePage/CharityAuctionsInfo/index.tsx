import { FC } from 'react';

import AuctionCard from 'src/components/customComponents/AuctionCard';
import { NoAuctionsInfo } from 'src/components/customComponents/AuctionsStatusInfo/NoAuctionsInfo';
import { ProfileSliderRow } from 'src/components/wrappers/ProfileSliderRow';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import { Auction } from 'src/types/Auction';

interface Props {
  auctions: Auction[];
  name: string;
}

export const CharityAuctionsInfo: FC<Props> = ({ auctions, name }) => {
  const profileAuctions = profileAuctionsHash(auctions);

  const liveAuctions = profileAuctions.ACTIVE;
  const pastAuctions = [...profileAuctions.SETTLED, ...profileAuctions.SOLD];

  const liveAuctionCards = liveAuctions.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction} />);
  const pastAuctionCards = pastAuctions.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction} />);

  if (auctions.length === 0) return <NoAuctionsInfo name={name} />;

  return (
    <>
      {Boolean(liveAuctions.length) && (
        <ProfileSliderRow items={liveAuctionCards}>Live auctions benefiting {name}</ProfileSliderRow>
      )}
      {Boolean(pastAuctions.length) && (
        <ProfileSliderRow items={pastAuctionCards}>Ended auctions benefiting {name}</ProfileSliderRow>
      )}
    </>
  );
};
