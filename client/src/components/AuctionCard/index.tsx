import { FC, useMemo } from 'react';

import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import CoverImage from 'src/components/CoverImage';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { Auction, AuctionStatus } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import DateDetails from './DateDetails';
import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  isDonePage?: boolean;
  horizontal?: boolean;
  auctionOrganizer?: InfluencerProfile;
};

const AuctionCard: FC<Props> = ({ auction, auctionOrganizer, horizontal, isDonePage }) => {
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

  const isDraft = auction.status === AuctionStatus.DRAFT;
  const linkToAuction = `/auctions/${auction.id}${isDraft ? '/basic' : ''}`;
  const priceFormatted = currentPrice.toFormat('$0,0');

  return (
    <figure
      className={clsx(styles.root, horizontal && styles.horizontalRoot, isDonePage && styles.horizontalOnMobileRoot)}
    >
      <CoverImage
        alt="Auction image"
        className={clsx(
          styles.image,
          horizontal && styles.horizontalImage,
          isDonePage && styles.horizontalOnMobileImage,
        )}
        src={imageSrc}
      />

      <figcaption
        className={clsx(
          styles.description,
          horizontal && styles.horizontalDescription,
          isDonePage && styles.horizontalOnMobileDescription,
        )}
      >
        <Link className={styles.link} title={influencer.name} to={`/profiles/${influencer?.id}`}>
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
        </Link>
        <Link
          className={clsx(styles.auctionTitle, 'text-subhead mb-0 mb-md-1 text-left break-word')}
          title={auction.title}
          to={linkToAuction}
        >
          {auction.title}
        </Link>
        <p className="text-subhead text-left text-truncate m-0 pb-2 pb-md-3" title={priceFormatted}>
          {priceFormatted}
        </p>

        {isDraft && <p className="text-label text-all-cups mb-0 mt-1 text-left">DRAFT</p>}

        {!isDraft && (
          <p className="text-label text-all-cups mb-0 mt-auto text-left">
            <DateDetails auction={auction} isDonePage={isDonePage} />
          </p>
        )}
      </figcaption>
    </figure>
  );
};

export default AuctionCard;
