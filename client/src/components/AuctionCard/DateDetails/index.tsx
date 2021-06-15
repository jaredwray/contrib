import { FC } from 'react';

import { isPast } from 'date-fns';
import { toDate, utcToZonedTime } from 'date-fns-tz';

import { pluralize } from 'src/helpers/pluralize';
import { toFullHumanReadableDatetime, toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { utcTimeZones } from 'src/modules/auctions/editAuction/DetailsPage/consts';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  isDonePage?: boolean;
  isSold?: boolean;
};

const DateDetails: FC<Props> = ({ auction, isDonePage, isSold }) => {
  const timeZone = utcTimeZones.find((tz) => auction.timeZone === tz.label)?.value;
  const auctionStartDate = utcToZonedTime(auction.startDate, timeZone || '');
  if (isSold) {
    return <span className={styles.ended}>sold</span>;
  }
  if (auction.isStopped) {
    return <span className={styles.ended}>stopped</span>;
  }

  if (isPast(toDate(auction.endDate))) {
    return <span className={styles.ended}>ended</span>;
  }

  if (isDonePage) {
    return (
      <>
        starts on {toFullHumanReadableDatetime(auctionStartDate)} {auction.timeZone}
      </>
    );
  }

  return (
    <>
      {pluralize(auction.totalBids ?? 0, 'bid')} • {toHumanReadableDuration(auction.endDate)}
    </>
  );
};

export default DateDetails;
