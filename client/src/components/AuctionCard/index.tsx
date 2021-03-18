import { FC } from 'react';

import clsx from 'clsx';
import { differenceInHours, toDate, parseISO, format } from 'date-fns';
import { Image } from 'react-bootstrap';

import CoverImage from 'src/components/CoverImage';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';
import { pluralize } from './utils';

type Props = {
  auction: Auction;
  horizontal?: boolean;
  justCreated?: boolean;
};

const AuctionCard: FC<Props> = ({ auction, horizontal, justCreated }) => {
  const startDate = toDate(parseISO(auction.startDate));

  const date = format(startDate, 'd.mm.yy');
  const time = format(startDate, 'hh:mm');
  const dayPeriod = format(startDate, 'a');
  const currentTimeZone = format(startDate, 'x');

  const hours = differenceInHours(toDate(parseISO(auction.endDate)), new Date());
  const hoursLeft = hours % 24;
  const daysLeft = Math.floor(hours / 24);

  const imageSrc = auction.attachments[0]?.url;

  return (
    <figure className={clsx(styles.root, horizontal && styles.horizontalRoot)}>
      <CoverImage
        alt="Auction image"
        className={clsx(styles.image, horizontal && styles.horizontalImage)}
        src={imageSrc}
      />

      <figcaption className={clsx(styles.description, horizontal && styles.horizontalDescription)}>
        <div className="d-lg-flex align-items-center mb-2">
          <Image roundedCircle className="mr-2" height={32} src={auction.auctionOrganizer.avatarUrl} width={32} />
          <span className="text-label text-all-cups">{auction.auctionOrganizer.name}</span>
        </div>

        <p className={clsx(styles.title, 'text-subhead mb-0 text-left')}>{auction.title}</p>
        <p className="text-subhead text-left">${auction.initialPrice.amount / 100}</p>

        {!justCreated ? (
          <p className="text-label text-all-cups mb-0 mt-auto text-left">
            {pluralize(auction.bids.length, 'bid')} • {daysLeft && `${daysLeft}d`} {hoursLeft && `${hoursLeft}h`}
          </p>
        ) : (
          <p className="text-label text-all-cups mb-0 mt-auto text-left">
            starts on {`${date} @ ${time} ${dayPeriod} ${currentTimeZone}`}
          </p>
        )}
      </figcaption>
    </figure>
  );
};

export default AuctionCard;
