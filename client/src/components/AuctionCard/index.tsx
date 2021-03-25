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
  horizontalOnMobile?: boolean;
  auctionOrganizer?: InfluencerProfile;
  footer?: string;
};

const AuctionCard: FC<Props> = ({ auction, auctionOrganizer, horizontal, horizontalOnMobile, footer }) => {
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
  const isDraft = auction.status === AuctionStatus.DRAFT;
  const linkToAuction = `/auctions/${auction.id}${isDraft ? '/basic' : ''}`;
  const priceFormatted = currentPrice.toFormat('$0,0');

  return (
    <figure
      className={clsx(
        styles.root,
        horizontal && styles.horizontalRoot,
        horizontalOnMobile && styles.horizontalOnMobileRoot,
      )}
    >
      <CoverImage
        alt="Auction image"
        className={clsx(
          styles.image,
          horizontal && styles.horizontalImage,
          horizontalOnMobile && styles.horizontalOnMobileImage,
        )}
        src={imageSrc}
      />

      <figcaption
        className={clsx(
          styles.description,
          horizontal && styles.horizontalDescription,
          horizontalOnMobile && styles.horizontalOnMobileDescription,
        )}
      >
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
          className={clsx(styles.auctionTitle, 'text--body mb-0 text-left break-word')}
          title={auction.title}
          to={linkToAuction}
        >
          {auction.title}
        </Link>
        <p className="text--body text-left text-truncate m-0 pb-3" title={priceFormatted}>
          {priceFormatted}
        </p>

        {isDraft && <p className="text-label text-all-cups mb-0 mt-auto text-left">DRAFT</p>}

        {!isDraft && (
          <p className="text-label text-all-cups mb-0 mt-auto text-left">
            {footer ?? (
              <>
                {pluralize(auction.totalBids ?? 0, 'bid')} • {ended && 'ended on '}
                {toHumanReadableDuration(auction.endDate)}
              </>
            )}
          </p>
        )}
      </figcaption>
    </figure>
  );
};

export default AuctionCard;
