import { FC, ReactElement, useCallback, useContext, useState } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { toDate } from 'date-fns-tz';

import { FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import FollowBtn from 'src/components/buttons/FollowBtn';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Auction } from 'src/types/Auction';

import About from './About';
import Author from './Author';
import Benefits from './Benefits';
import ShareBtn from './ShareBtn';
import styles from './styles.module.scss';

interface Props {
  auction: Auction;
}

const GeneralInformation: FC<Props> = ({ auction }): ReactElement => {
  const [followAuction, { loading: followLoading }] = useMutation(FollowAuctionMutation);
  const [unfollowAuction, { loading: unfollowLoading }] = useMutation(UnfollowAuctionMutation);
  const auctionId = auction.id;
  const { endDate, followers } = auction;
  const { account } = useContext(UserAccountContext);
  const { isAuthenticated } = useAuth();
  const { showMessage, showError } = useShowNotification();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const [followed, setFollowed] = useState(() => followers?.some((follower) => follower.user === account?.mongodbId));
  const [followersNumber, setFollowersNumber] = useState(followers?.length || 0);
  const ended = toDate(endDate) <= new Date();

  const handleFollowAuction = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await followAuction({ variables: { auctionId } });
        showMessage('Successfully followed');
        setFollowed(true);
        setFollowersNumber(followersNumber ? followersNumber + 1 : 1);
      } catch (error) {
        showError(error.message);
      }
      return;
    }

    RedirectWithReturnAfterLogin(`/auctions/${auctionId}`);
  }, [
    auctionId,
    showError,
    showMessage,
    followAuction,
    followersNumber,
    isAuthenticated,
    RedirectWithReturnAfterLogin,
  ]);

  const handleUnfollowAuction = useCallback(async () => {
    try {
      await unfollowAuction({ variables: { auctionId } });
      showMessage('Successfully unfollowed');
      setFollowed(false);
      setFollowersNumber(followersNumber - 1);
    } catch (error) {
      showError(error.message);
    }
  }, [auctionId, showError, showMessage, unfollowAuction, followersNumber]);

  return (
    <>
      <div className="framed">
        <Author {...auction.auctionOrganizer} />
        <About {...auction} />
      </div>
      <div className="framed mt-4">
        <Benefits {...auction.charity} />
      </div>
      <div className="framed mt-4">
        {auction.isActive && !ended && (
          <FollowBtn
            className={clsx(styles.followBtn, 'text-body-new pb-3')}
            entityType="auction"
            followHandler={handleFollowAuction}
            followed={followed}
            followersNumber={followersNumber}
            loading={followLoading || unfollowLoading}
            unfollowHandler={handleUnfollowAuction}
          />
        )}
        <ShareBtn link={auction.shortLink.shortLink} />
      </div>
    </>
  );
};

export default GeneralInformation;
