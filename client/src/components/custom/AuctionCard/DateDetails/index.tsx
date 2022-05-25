import { FC } from 'react';

import { pluralize } from 'src/helpers/pluralize';
import { toFullHumanReadableDatetime, toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  isDonePage?: boolean;
};

const DateDetails: FC<Props> = ({ auction, isDonePage }) => {
  if (isDonePage) return <>Ends on {toFullHumanReadableDatetime(new Date(auction.endsAt))}</>;
  const date = auction.isSold ? auction.stoppedAt : auction.endsAt;

  return (
    <>
      <span className={styles.bids}>{pluralize(auction.totalBids ?? 0, 'bid')}</span>
      <span className={styles.dot}>•</span>
      <span>{toHumanReadableDuration(date || '')}</span>
    </>
  );
};

export default DateDetails;
