import { FC } from 'react';

import { toDate } from 'date-fns-tz';

import { pluralize } from 'src/helpers/pluralize';
import { toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

type Props = {
  auction: Auction;
};

const Footer: FC<Props> = ({ auction }) => {
  if (toDate(auction.endDate) <= new Date()) {
    return <span className={styles.ended}>ended</span>;
  }

  return (
    <>
      {pluralize(auction.totalBids ?? 0, 'bid')} • {toHumanReadableDuration(auction.endDate)}
    </>
  );
};

export default Footer;
