import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auction: Auction | null;
}

const AuctionPreview: FC<Props> = ({ auction }) => {
  return (
    <div className="d-inline-block">
      <div className={clsx(styles.auction, 'pr-3')}>
        <div className={styles.like} />
        <Image className={styles.auctionPicture} src="/content/img/auctions/auction-item-1.webp" />
        <div className="p-3">
          <Image
            roundedCircle
            className={clsx(styles.ownerPicture, 'd-inline-block')}
            src="/content/img/users/auction-owner-1.webp"
          />
          <div className="text-sm mb-md-0 text-label text-all-cups pl-2 d-inline-block">De'aaron Fox</div>
          <div className={clsx(styles.auctionTitle, 'text-subhead pt-2')}>
            De'Aaron Fox Autographed Game Worn Jersey
          </div>
          <div className="text-body-super">$260.00</div>
          <div className="text-label text-all-cups pt-2">1 bid • 7d 21h</div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPreview;
