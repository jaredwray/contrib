import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { format as dateFormat } from 'date-fns';
import { toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';

import { auctionTimeLeft } from 'src/helpers/auctionTimeLeft';
import { Auction, AuctionStatus } from 'src/types/Auction';

import BidInput from './BidInput';
import styles from './styles.module.scss';
import WatchBtn from './WatchBtn';

interface Props {
  auction: Auction;
}

const AuctionDetails: FC<Props> = ({ auction }): ReactElement => {
  const maxBid = Dinero(Object(auction.maxBid?.bid || auction.initialPrice));
  const timeLeft = auctionTimeLeft(auction.endDate);
  const endDateFomated = dateFormat(toDate(auction.endDate), 'MMM dd yyyy');

  return (
    <>
      <div className={clsx(styles.title, 'text-subhead pt-2')}>{auction.title}</div>
      <div className="text-headline">{maxBid.toFormat('$0.00')}</div>
      <div className="text-label text-all-cups pt-3 pb-3">
        {auction.bids?.length || 0} bids{' '}
        <span className="float-right">
          {timeLeft && (
            <>
              <span className={styles.notBold}>ends in</span> {timeLeft}{' '}
            </>
          )}
          <span className={styles.notBold}>{!timeLeft && 'ended'} on</span> {endDateFomated}
        </span>
      </div>
      {auction.status === AuctionStatus.ACTIVE && (
        <>
          <BidInput maxBid={maxBid} />
          <WatchBtn auction={auction} />
        </>
      )}
    </>
  );
};

export default AuctionDetails;
