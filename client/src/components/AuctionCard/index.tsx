import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import CoverImage from 'src/components/CoverImage';
import { pluralize } from 'src/helpers/pluralize';
import { toFullHumanReadableDatetime, toHumanReadableDatetime } from 'src/helpers/timeFormatters';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  horizontal?: boolean;
  justCreated?: boolean;
};

const AuctionCard: FC<Props> = ({ auction, horizontal, justCreated }) => {
  const imageSrc = auction.attachments[0]?.url;

  if (!auction) {
    return null;
  }
  return (
    <figure className={clsx(styles.root, horizontal ? styles.horizontalRoot : styles.verticalRoot)}>
      <CoverImage
        alt="Auction image"
        className={clsx(styles.image, horizontal && styles.horizontalImage)}
        src={imageSrc}
      />

      <figcaption className={clsx(styles.description, horizontal && styles.horizontalDescription)}>
        <Link className={styles.link} to={`/profiles/${auction.auctionOrganizer?.id}`}>
          <div className="d-flex align-items-center mb-2">
            <Image roundedCircle className="mr-2" height={32} src={auction.auctionOrganizer?.avatarUrl} width={32} />
            <span className={clsx(horizontal && styles.name, 'text-label text-all-cups')}>
              {auction.auctionOrganizer?.name}
            </span>
          </div>
        </Link>
        <Link className={clsx(styles.auctionTitle, 'text-subhead mb-0 text-left')} to={`/auction/${auction.id}`}>
          <p className="mb-0">{auction.title}</p>
        </Link>
        <p className="text-subhead text-left">${auction.initialPrice?.amount / 100}</p>

        {!justCreated ? (
          <p className="text-label text-all-cups mb-0 mt-auto text-left">
            {pluralize(auction.bids?.length, 'bid')} • {toHumanReadableDatetime(auction.endDate)}
          </p>
        ) : (
          <p className="text-label text-all-cups mb-0 mt-auto text-left">
            starts on {toFullHumanReadableDatetime(auction.startDate)}
          </p>
        )}
      </figcaption>
    </figure>
  );
};

export default AuctionCard;
