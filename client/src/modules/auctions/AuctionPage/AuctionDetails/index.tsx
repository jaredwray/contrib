import { FC, ReactElement, useState } from 'react';

import clsx from 'clsx';
import { format as dateFormat } from 'date-fns';
import { toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';

import { pluralize } from 'src/helpers/pluralize';
import { toHumanReadableDatetime } from 'src/helpers/timeFormatters';
import { Auction, AuctionStatus } from 'src/types/Auction';

import BidInput from './BidInput';
import styles from './styles.module.scss';
import WatchBtn from './WatchBtn';

const AuctionDetails: FC<Auction> = (auction): ReactElement => {
  const { initialPrice, endDate, bids, title, status } = auction;
  const [maxBid, setMaxBid] = useState(Dinero(Object(auction.maxBid?.bid || initialPrice)));
  const timeLeft = toHumanReadableDatetime(endDate);
  const endDateFormatted = dateFormat(toDate(endDate), 'MMM dd yyyy');

  return (
    <>
      <div className={clsx(styles.title, 'text-subhead pt-2')}>{title}</div>
      <div className="text-headline">{maxBid.toFormat('$0.00')}</div>
      <div className="text-label text-all-cups pt-3 pb-3">
        {pluralize(bids?.length, 'bid')}{' '}
        <span className="float-right">
          {timeLeft && (
            <>
              <span className={styles.notBold}>ends in</span> {timeLeft}{' '}
            </>
          )}
          <span className={styles.notBold}>{!timeLeft && 'ended'} on</span> {endDateFormatted}
        </span>
      </div>
      {status === AuctionStatus.ACTIVE && (
        <>
          <BidInput auctionId={auction.id} maxBid={maxBid} setMaxBid={setMaxBid} />
          <WatchBtn auction={auction} />
        </>
      )}
    </>
  );
};

export default AuctionDetails;
