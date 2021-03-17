import { FC } from 'react';

import clsx from 'clsx';
import { differenceInHours } from 'date-fns';
import { toDate } from 'date-fns-tz';
import { Image } from 'react-bootstrap';

import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auction: Auction;
}

const AuctionPreview: FC<Props> = ({ auction }) => {
  const hours = differenceInHours(toDate(auction.endDate), new Date());
  const hoursLeft = hours % 24;
  const daysLeft = Math.floor(hours / 24);

  return (
    <div className={clsx('d-inline-block m-auto', styles.auction)}>
      <div className={clsx('d-inline-block', styles.picture)}>
        <Image className="w-100 h-100 d-flex" src="/content/img/auctions/auction-item-1.webp" />
      </div>
      <div className={clsx('p-3 float-right text-left', styles.descritpion)}>
        <div className="d-table-row">
          <Image roundedCircle className={styles.avatar} src="/content/img/users/auction-owner-1.webp" />
          <div
            className={clsx(
              'text-sm mb-md-0 text-label text-all-cups pl-2 d-table-cell align-middle',
              styles.ownerName,
            )}
            title="De’aaron Fox"
          >
            De’aaron Fox
          </div>
        </div>
        <div className={clsx('text--body pt-2', styles.auctionTitle)} title={auction.title}>
          {auction.title}
        </div>
        <div className="text--body-super">$400</div>
        <div className="text-label text-all-cups pt-2">
          1 bid • {daysLeft && `${daysLeft}d`} {hoursLeft && `${hoursLeft}h`}
        </div>
      </div>
    </div>
  );
};

export default AuctionPreview;
