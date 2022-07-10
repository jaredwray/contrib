import { FC, useCallback, useMemo, useState, useContext } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { useHistory } from 'react-router-dom';

import { DeleteAuctionMutation, FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import { CloseButton } from 'src/components/buttons/CloseButton';
import HeartBtn from 'src/components/buttons/HeartButton';
import CoverImage from 'src/components/custom/CoverImage';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { Modal } from 'src/components/modals/AdminAuctionsPageModal';
import SwipeableLink from 'src/components/wrappers/SwipeableLink';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import useAuctionPreviewAttachment from 'src/modules/auctions/hooks/useAuctionPreviewAttachment';
import { Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

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
  const { charity, isSettled, isDraft, isSold } = auction;
  const influencer = auctionOrganizer || auction.auctionOrganizer;
  const linkToAuction = `/auctions/${auctionId}${isDraft ? '/title' : ''}`;
  const isFinished = isSettled || isSold;
  const statusName = isSettled ? 'ENDED' : auction.status;

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
        {isFinished && <span className={styles.statusLabel}>{statusName}</span>}
        {!isDraft && false && (
          <HeartBtn
            className={styles.followBtn}
            followHandler={handleFollowAuction}
            followed={followed}
            loading={followLoading || unfollowLoading}
            unfollowHandler={handleUnfollowAuction}
          />
        )}
        <SwipeableLink
          className={clsx(styles.linkFix, 'position-relative', isSettled && styles.settled, isSold && styles.settled)}
          to={linkToAuction}
        >
          <CoverImage alt="Auction image" className={styles.image} formatSize={480} src={imageSrc} />
          <ProfileInfo link={`/profiles/${influencer.id}`} profile={influencer} />
        </SwipeableLink>
      </div>

      <figcaption
        className={clsx(
          styles.description,
          'd-flex flex-column p-3 pt-4',
          isSettled && styles.settled,
          isSold && styles.settled,
        )}
      >
        <SwipeableLink className={clsx(styles.title, 'mb-4 text-label-new')} title={auction.title} to={linkToAuction}>
          {auction.title}
        </SwipeableLink>

        <div className="text-label text-left">
          {isDraft && <span>DRAFT</span>}
          {(!isDraft || isDonePage) && <DateDetails auction={auction} isDonePage={isDonePage} />}
        </div>
        <div
          className={clsx(
            styles.price,
            'text-subhead text-left text-truncate mt-0 mb-4 mt-2',
            isFinished && 'text-decoration-line-through',
          )}
          title={priceFormatted}
        >
          {priceFormatted}
        </div>

        {charity && (
          <ProfileInfo
            isCharity
            charityClassName={clsx(styles.charity, 'text-all-cups')}
            link={`/charity/${charity.semanticId || charity.id}`}
            profile={charity}
          />
        )}
      </figcaption>
    </figure>
  );
};

export default AuctionCard;
