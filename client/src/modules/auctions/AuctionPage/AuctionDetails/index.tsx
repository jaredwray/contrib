import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { format as dateFormat } from 'date-fns';
import { toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';

import { pluralize } from 'src/helpers/pluralize';
import { toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { Auction, AuctionStatus } from 'src/types/Auction';

import BidInput from './BidInput';
import styles from './styles.module.scss';

interface Props {
  auction: Auction;
}

const AuctionDetails: FC<Props> = ({ auction }): ReactElement => {
  const { startPrice, maxBid, endDate, bids, title, status } = auction;
  const ended = toDate(endDate) <= new Date();
  const durationTillEnd = toHumanReadableDuration(endDate);
  const endDateFormatted = dateFormat(toDate(endDate), 'MMM dd yyyy');

  const price = (maxBid && Dinero(maxBid.bid)) || Dinero(startPrice);

  return (
    <>
      <div className={clsx(styles.title, 'text-subhead pt-2')}>{title}</div>
      <div className="text-headline">{price.toFormat('$0,0.00')}</div>
      <div className="text-label text-all-cups pt-3 pb-3">
        {pluralize(bids?.length, 'bid')}{' '}
        <span className="float-right">
          {!ended && (
            <>
              <span className={styles.notBold}>ends in</span> {durationTillEnd}{' '}
            </>
          )}
          <span className={styles.notBold}>{ended && 'ended'} on</span> {endDateFormatted}
        </span>
      </div>
      {status === AuctionStatus.ACTIVE && (
        <>
          <BidInput auctionId={auction.id} maxBid={price} />
          {/*<WatchBtn auction={auction} />*/}
        </>
      )}
    </>
  );
};

export default AuctionDetails;
