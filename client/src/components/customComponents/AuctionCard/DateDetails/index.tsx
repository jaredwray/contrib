import { FC } from 'react';

import { isPast } from 'date-fns';
import { toDate } from 'date-fns-tz';

import { pluralize } from 'src/helpers/pluralize';
import { toFullHumanReadableDatetime, toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  isDonePage?: boolean;
  isSold?: boolean;
};

const DateDetails: FC<Props> = ({ auction, isDonePage, isSold }) => {
  if (isSold) return <span className={styles.ended}>sold</span>;
  if (auction.isStopped) return <span className={styles.ended}>stopped</span>;
  if (isPast(toDate(auction.endDate))) return <span className={styles.ended}>ended</span>;
  if (isDonePage) return <>ends on {toFullHumanReadableDatetime(new Date(auction.endDate))}</>;

  return (
    <div className="text-label text-left">
      <span className={styles.bids}>{pluralize(auction.totalBids ?? 0, 'bid')}</span>
      <span className={styles.dot}>•</span>
      <span className="text-all-cups ">{toHumanReadableDuration(auction.endDate)}</span>
    </div>
  );
};

export default DateDetails;
