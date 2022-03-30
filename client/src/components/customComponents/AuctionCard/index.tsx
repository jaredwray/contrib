import { FC, useCallback, useMemo, useState, useContext } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { useHistory } from 'react-router-dom';

import { DeleteAuctionMutation, FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import { CloseButton } from 'src/components/buttons/CloseButton';
import CoverImage from 'src/components/customComponents/CoverImage';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { Modal } from 'src/components/modals/AdminAuctionsPageModal';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import useAuctionPreviewAttachment from 'src/modules/auctions/hooks/useAuctionPreviewAttachment';
import { Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import HeartBtn from '../../buttons/HeartButton';
import SwipeableLink from '../../wrappers/SwipeableLink';
import DateDetails from './DateDetails';
import ProfileInfo from './ProfileInfo';
import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  isDonePage?: boolean;
  auctionOrganizer?: InfluencerProfile;
  onDelete?: (auction: Auction) => void;
};

const AuctionCard: FC<Props> = ({ auction, auctionOrganizer, isDonePage, onDelete }) => {
  const auctionId = auction?.id;

  const { account } = useContext(UserAccountContext);
  const imageSrc = useAuctionPreviewAttachment(auction?.attachments);
  const { showMessage, showError } = useShowNotification();
  const { isAuthenticated } = useAuth();
  const history = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const [followAuction, { loading: followLoading }] = useMutation(FollowAuctionMutation);
  const [unfollowAuction, { loading: unfollowLoading }] = useMutation(UnfollowAuctionMutation);

  const [showDialog, setShowDialog] = useState(false);
  const [followed, setFollowed] = useState(() =>
    auction?.followers?.some((follower) => follower.user === account?.mongodbId),
  );

  const currentPrice = useMemo(() => {
    if (!auction) return Dinero();
    if (auction.currentPrice) return Dinero(auction.currentPrice);

    return Dinero(auction.startPrice);
  }, [auction]);

  const handleFollowAuction = useCallback(async () => {
    if (!isAuthenticated) return RedirectWithReturnAfterLogin(history.location.pathname);

    try {
      await followAuction({ variables: { auctionId } });
      showMessage('Successfully followed');
      setFollowed(true);
    } catch (error) {
      showError(error.message);
    }
  }, [
    auctionId,
    showMessage,
    showError,
    followAuction,
    isAuthenticated,
    history.location.pathname,
    RedirectWithReturnAfterLogin,
  ]);

  const handleUnfollowAuction = useCallback(async () => {
    try {
      await unfollowAuction({ variables: { auctionId } });
      showMessage('Successfully unfollowed');
      setFollowed(false);
    } catch (error) {
      showError(error.message);
    }
  }, [auctionId, showMessage, showError, unfollowAuction]);

  if (!auction) return null;

  const priceFormatted = currentPrice.toFormat('$0,0');
  const { charity, isActive, isSettled, isDraft, isSold } = auction;
  const influencer = auctionOrganizer || auction.auctionOrganizer;
  const linkToAuction = `/auctions/${auctionId}${isDraft ? '/title' : ''}`;

  return (
    <figure className={clsx(styles.root, 'd-flex flex-column m-0')}>
      {isDraft && <CloseButton action={() => setShowDialog(true)} auctionDeleteBtn={true} />}
      <Modal
        auction={auction}
        mutation={DeleteAuctionMutation}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={onDelete}
      />
      <div className="position-relative">
        <SwipeableLink to={linkToAuction}>
          <CoverImage
            alt="Auction image"
            className={clsx(styles.image, isSettled && styles.settled, isSold && styles.settled)}
            formatSize={480}
            src={imageSrc}
          />
        </SwipeableLink>
      </div>

      <figcaption className={clsx(styles.description, 'd-flex flex-column')}>
        <SwipeableLink className={clsx(styles.title, 'text-label-new')} title={auction.title} to={linkToAuction}>
          {auction.title}
        </SwipeableLink>

        <ProfileInfo link={`/profiles/${influencer.id}`} profile={influencer} />
        {charity && (
          <ProfileInfo
            isCharity
            className={clsx(styles.charity, 'text-all-cups1')}
            link={`/charity/${charity.semanticId || charity.id}`}
            profile={charity}
          />
        )}

        <div className="text-subhead text-left text-truncate mt-auto" title={priceFormatted}>
          {priceFormatted}
        </div>

        <div className="text-label text-left">
          {isDraft && <span>DRAFT</span>}
          {(isActive || isSettled || isSold || isDonePage) && (
            <DateDetails auction={auction} isDonePage={isDonePage} isSold={isSold} />
          )}
        </div>
      </figcaption>
    </figure>
  );
};

export default AuctionCard;
