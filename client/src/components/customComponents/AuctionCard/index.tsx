import { FC, useCallback, useMemo, useState, useContext } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { DeleteAuctionMutation, FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import { CloseButton } from 'src/components/buttons/CloseButton';
import CoverImage from 'src/components/customComponents/CoverImage';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { Modal } from 'src/components/modals/AdminAuctionsPageModal';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import useAuctionPreviewAttachment from 'src/modules/auctions/hooks/useAuctionPreviewAttachment';
import { Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import HeartBtn from '../../buttons/HeartButton';
import SwipeableLink from '../../wrappers/SwipeableLink';
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
  const { isAuthenticated } = useAuth();
  const hisory = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const [followAuction, { loading: followLoading }] = useMutation(FollowAuctionMutation);
  const [unfollowAuction, { loading: unfollowLoading }] = useMutation(UnfollowAuctionMutation);

  const followers = auction?.followers;
  const loading = followLoading || unfollowLoading;
  const isOwner = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction?.auctionOrganizer.id,
  );

  const [showDialog, setShowDialog] = useState(false);
  const [followed, setFollowed] = useState(() => followers?.some((follower) => follower.user === account?.mongodbId));

  const imageSrc = useAuctionPreviewAttachment(auction?.attachments);
  const influencer = auctionOrganizer || auction?.auctionOrganizer;
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

    RedirectWithReturnAfterLogin(hisory.location.pathname);
  }, [auction?.id, addToast, followAuction, isAuthenticated, hisory.location.pathname, RedirectWithReturnAfterLogin]);

  const handleUnfollowAuction = useCallback(async () => {
    try {
      await unfollowAuction({ variables: { auctionId: auction.id } });
      addToast('Successfully unfollowed', { autoDismiss: true, appearance: 'success' });
      setFollowed(false);
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'warning' });
    }
  }, [auction?.id, addToast, unfollowAuction]);

  if (!auction) {
    return null;
  }

  const priceFormatted = currentPrice.toFormat('$0,0');
  const { isActive, isSettled, isDraft, isSold } = auction;
  const linkToAuction = `/auctions/${isDraft ? `${auction.id}/title` : auction.id}`;

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
            formatSize={480}
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
              className={clsx(styles.avatarUrl, 'mr-2')}
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
