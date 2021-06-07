import { FC, useMemo } from 'react';

import clsx from 'clsx';
import { format as dateFormat } from 'date-fns';
import { format, utcToZonedTime, toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Image } from 'react-bootstrap';

import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import useAuctionPreviewAttachment from 'src/modules/auctions/hooks/useAuctionPreviewAttachment';
import { Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import SwipeableLink from '../SwipeableLink';
import CoverImage from './CoverImage';
import DateDetails from './DateDetails';
import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  isDonePage?: boolean;
  horizontal?: boolean;
  auctionOrganizer?: InfluencerProfile;
};

const AuctionCard: FC<Props> = ({ auction, auctionOrganizer, horizontal, isDonePage }) => {
  const imageSrc = useAuctionPreviewAttachment(auction.attachments);
  const influencer = auctionOrganizer || auction.auctionOrganizer;
  const currentPrice = useMemo(() => {
    if (!auction) {
      return Dinero();
    }

    if (auction.currentPrice) {
      return Dinero(auction.currentPrice);
    }

    return Dinero(auction.startPrice);
  }, [auction]);

  if (!auction) {
    return null;
  }

  const priceFormatted = currentPrice.toFormat('$0,0');
  const { startDate, timeZone, isSettled, isDraft, isPending, isSold } = auction;
  const startTime = format(utcToZonedTime(startDate, timeZone), 'p');
  const startFormatted = dateFormat(toDate(utcToZonedTime(startDate, timeZone)), 'MMM dd yyyy');
  const linkToAuction = `/auctions/${auction.id}${isDraft ? '/basic' : ''}`;

  return (
    <figure
      className={clsx(styles.root, horizontal && styles.horizontalRoot, isDonePage && styles.horizontalOnMobileRoot)}
    >
      <SwipeableLink to={linkToAuction}>
        <CoverImage
          alt="Auction image"
          className={clsx(
            styles.image,
            horizontal && styles.horizontalImage,
            isDonePage && styles.horizontalOnMobileImage,
            isSettled && styles.settled,
            isSold && styles.settled,
          )}
          src={imageSrc}
        />
      </SwipeableLink>

      <figcaption
        className={clsx(
          styles.description,
          horizontal && styles.horizontalDescription,
          isDonePage && styles.horizontalOnMobileDescription,
        )}
      >
        <SwipeableLink className={styles.link} title={influencer.name} to={`/profiles/${influencer?.id}`}>
          <div className="d-flex align-items-center mb-1">
            <Image
              roundedCircle
              className="mr-2"
              height={32}
              src={ResizedImageUrl(influencer.avatarUrl, 32)}
              width={32}
            />
            <span className={clsx(horizontal && styles.name, 'text-label text-all-cups text-truncate')}>
              {influencer.name}
            </span>
          </div>
        </SwipeableLink>
        <SwipeableLink
          className={clsx(styles.auctionTitle, 'text-subhead mb-0 mb-md-1 text-left break-word')}
          title={auction.title}
          to={linkToAuction}
        >
          {auction.title}
        </SwipeableLink>
        <p className="text-subhead text-left text-truncate m-0 pb-2 pb-md-3" title={priceFormatted}>
          {priceFormatted}
        </p>

        {isDraft && <p className="text-label text-all-cups mb-0 mt-1 text-left">DRAFT</p>}
        {isPending && (
          <p className="text-label text-all-cups mb-0 mt-1 text-left">{`starts in ${startTime} on ${startFormatted} `}</p>
        )}

        {!isDraft && !isPending && (
          <p className="text-label text-all-cups mb-0 mt-auto text-left">
            <DateDetails auction={auction} isDonePage={isDonePage} isSold={isSold} />
          </p>
        )}
      </figcaption>
    </figure>
  );
};

export default AuctionCard;
