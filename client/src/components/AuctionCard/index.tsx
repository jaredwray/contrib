import { FC, useMemo } from 'react';

import clsx from 'clsx';
import { toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import CoverImage from 'src/components/CoverImage';
import { pluralize } from 'src/helpers/pluralize';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { Auction, AuctionStatus } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  horizontal?: boolean;
  auctionOrganizer?: InfluencerProfile;
};

const AuctionCard: FC<Props> = ({ auction, auctionOrganizer, horizontal }) => {
  console.log('🚀 ~ file: index.tsx ~ line 25 ~ auction', auction);
  const imageSrc = auction.attachments[0]?.url;

  const influencer = auctionOrganizer || auction.auctionOrganizer;
  const currentPrice = useMemo(() => {
    if (!auction) {
      return Dinero();
    }

    if (auction.maxBid) {
      return Dinero(auction.maxBid.bid);
    }

    return Dinero(auction.startPrice);
  }, [auction]);

  if (!auction) {
    return null;
  }

  const ended = toDate(auction.endDate) <= new Date();
  const draftStatus = auction.status === AuctionStatus.DRAFT;
  const linkToAuction = `/auctions/${auction.id}${draftStatus ? '/basic' : ''}`;

  return (
    <figure className={clsx(styles.root, horizontal ? styles.horizontalRoot : styles.verticalRoot)}>
      <CoverImage
        alt="Auction image"
        className={clsx(styles.image, horizontal && styles.horizontalImage)}
        src={imageSrc}
      />

      <figcaption className={clsx(styles.description, horizontal && styles.horizontalDescription)}>
        <Link className={styles.link} to={`/profiles/${influencer?.id}`}>
          <div className="d-flex align-items-center mb-2">
            <Image
              roundedCircle
              className="mr-2"
              height={32}
              src={ResizedImageUrl(influencer?.avatarUrl, 32)}
              width={32}
            />
            <span className={clsx(horizontal && styles.name, 'text-label text-all-cups text-truncate')}>
              {influencer?.name}
            </span>
          </div>
        </Link>
        <Link
          className={clsx(styles.auctionTitle, 'text-subhead mb-0 text-left break-word')}
          title={auction.title}
          to={linkToAuction}
        >
          {auction.title}
        </Link>
        <p className="text-subhead text-left text-truncate" title={currentPrice.toFormat('$0,0.00')}>
          {currentPrice.toFormat('$0,0.00')}
        </p>

        {draftStatus && <p className="text-label text-all-cups mb-0 mt-auto text-left">DRAFT</p>}

        {!draftStatus && (
          <p className="text-label text-all-cups mb-0 mt-auto text-left">
            {pluralize(auction.totalBids ?? 0, 'bid')} •{ended && ' ended'} {toHumanReadableDuration(auction.endDate)}
          </p>
        )}
      </figcaption>
    </figure>
  );
};

export default AuctionCard;
