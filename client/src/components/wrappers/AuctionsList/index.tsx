import { FC } from 'react';

import clsx from 'clsx';

import AuctionCard from 'src/components/customComponents/AuctionCard';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auctions: Auction[];
  label: string;
}

const AuctionsList: FC<Props> = ({ auctions, label }) => {
  if (!auctions.length) return null;

  return (
    <div className="mb-4">
      <span className="label-with-separator text-label mb-4 d-block ">{label}</span>
      <div className={clsx(styles.auctions, 'd-grid align-items-center')}>
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};
export default AuctionsList;
