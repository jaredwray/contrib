import { FC, useCallback, useMemo, useState, useContext } from 'react';

import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import { format as dateFormat } from 'date-fns';
import { format, utcToZonedTime, toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { DeleteAuctionMutation, FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import { Modal } from 'src/components/AdminAuctionsPageModal';
import { CloseButton } from 'src/components/CloseButton';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { mergeUrlPath } from 'src/helpers/mergeUrlPath';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { utcTimeZones } from 'src/modules/auctions/editAuction/DetailsPage/consts';
import useAuctionPreviewAttachment from 'src/modules/auctions/hooks/useAuctionPreviewAttachment';
import { Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import HeartBtn from '../HeartButton';
import SwipeableLink from '../SwipeableLink';
import CoverImage from './CoverImage';
import DateDetails from './DateDetails';
import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  isDonePage?: boolean;
  horizontal?: boolean;
  auctionOrganizer?: InfluencerProfile;
  onDelete?: (auction: Auction) => void;
};

const AuctionCard: FC<Props> = ({ auction, auctionOrganizer, horizontal, isDonePage, onDelete }) => {
  const { account } = useContext(UserAccountContext);
  const { addToast } = useToasts();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const hisory = useHistory();

  const [followAuction, { loading: followLoading }] = useMutation(FollowAuctionMutation);
  const [unfollowAuction, { loading: unfollowLoading }] = useMutation(UnfollowAuctionMutation);

  const followers = auction.followers;
  const loading = followLoading || unfollowLoading;
  const isOwner = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction.auctionOrganizer.id,
  );

  const [showDialog, setShowDialog] = useState(false);
  const [followed, setFollowed] = useState(() => followers?.some((follower) => follower.user === account?.mongodbId));

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

  const handleFollowAuction = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await followAuction({ variables: { auctionId: auction.id } });
        addToast('Successfully followed', { autoDismiss: true, appearance: 'success' });
        setFollowed(true);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'warning' });
      }
      return;
    }

    const followPath = hisory.location.pathname;
    const redirectUri = mergeUrlPath(
      process.env.REACT_APP_PLATFORM_URL,
      `/after-login?returnUrl=${encodeURIComponent(followPath)}`,
    );
    loginWithRedirect({ redirectUri }).catch((error) => {
      addToast(error.message, { appearance: 'error', autoDismiss: true });
    });
  }, [auction.id, addToast, followAuction, isAuthenticated, loginWithRedirect, hisory.location.pathname]);

  const handleUnfollowAuction = useCallback(async () => {
    try {
      await unfollowAuction({ variables: { auctionId: auction.id } });
      addToast('Successfully unfollowed', { autoDismiss: true, appearance: 'success' });
      setFollowed(false);
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'warning' });
    }
  }, [auction.id, addToast, unfollowAuction]);

  if (!auction) {
    return null;
  }

  const priceFormatted = currentPrice.toFormat('$0,0');
  const { startDate, isActive, isSettled, isDraft, isPending, isSold } = auction;
  const timeZone = utcTimeZones.find((timeZone) => timeZone.label === auction.timeZone)?.value;
  const startTime = format(utcToZonedTime(startDate, timeZone || ''), 'p');
  const startFormatted = dateFormat(toDate(utcToZonedTime(startDate, timeZone || '')), 'MMM dd yyyy');
  const linkToAuction = `/auctions/${auction.id}${isDraft ? '/basic' : ''}`;

  return (
    <figure
      className={clsx(styles.root, horizontal && styles.horizontalRoot, isDonePage && styles.horizontalOnMobileRoot)}
    >
      {isDraft && <CloseButton action={() => setShowDialog(true)} auctionDeleteBtn={true} />}
      <Modal
        auction={auction}
        mutation={DeleteAuctionMutation}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={onDelete}
      />
      <div className={clsx(styles.wrapper)}>
        {!isDraft && (
          <HeartBtn
            className={clsx(styles.followBtn)}
            disabled={isOwner}
            followHandler={handleFollowAuction}
            followed={followed}
            loading={loading}
            unfollowHandler={handleUnfollowAuction}
          />
        )}
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
      </div>

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
          className={clsx(styles.auctionTitle, 'text-subhead mb-0 mb-md-1 text-left ')}
          title={auction.title}
          to={linkToAuction}
        >
          {auction.title}
        </SwipeableLink>
        <p className="text-subhead text-left text-truncate m-0 pb-2 pb-md-3" title={priceFormatted}>
          {priceFormatted}
        </p>

        {isDraft && <p className="text-label text-all-cups mb-0 mt-1 text-left">DRAFT</p>}

        {isPending && !isDonePage && (
          <p className="text-label text-all-cups mb-0 mt-1 text-left">{`starts in ${startTime} ${auction.timeZone} on ${startFormatted}`}</p>
        )}

        {(isActive || isSettled || isSold || isDonePage) && (
          <p className="text-label text-all-cups mb-0 mt-auto text-left">
            <DateDetails auction={auction} isDonePage={isDonePage} isSold={isSold} />
          </p>
        )}
      </figcaption>
    </figure>
  );
};

export default AuctionCard;
