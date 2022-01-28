import { FC } from 'react';

import clsx from 'clsx';

import AuctionCard from 'src/components/customComponents/AuctionCard';
import { NoAuctionsInfo } from 'src/components/customComponents/AuctionsStatusInfo/NoAuctionsInfo';
import { ProfileSliderRow } from 'src/components/wrappers/ProfileSliderRow';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auctions: Auction[];
  name: string;
}

export const CharityAuctionsInfo: FC<Props> = ({ auctions, name }) => {
  const profileAuctions = profileAuctionsHash(auctions);

  const liveAuctions = profileAuctions.ACTIVE;
  const pastAuctions = [...profileAuctions.SETTLED, ...profileAuctions.SOLD];

  const pastAuctionCards = pastAuctions.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction} />);

  if (auctions.length === 0) return <NoAuctionsInfo name={name} />;

  return (
    <>
      {Boolean(liveAuctions.length) && (
        <div className="mb-4">
          <span className="label-with-separator text-label mb-4 d-block ">Live auctions benefiting {name}</span>
          <div className={clsx(styles.auctions, 'd-grid align-items-center')}>
            {liveAuctions.map((auction: Auction) => (
              <AuctionCard key={auction.id} horizontal auction={auction} />
            ))}
          </div>
        </div>
      )}
      {Boolean(pastAuctions.length) && (
        <ProfileSliderRow items={pastAuctionCards}>Ended auctions benefiting {name}</ProfileSliderRow>
      )}
    </>
  );
};
