import { FC, useCallback, useState, useContext } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

import { FollowCharity, UnfollowCharity } from 'src/apollo/queries/charityProfile';
import { FollowInfluencer, UnfollowInfluencer } from 'src/apollo/queries/influencers';
import CoverImage from 'src/components/customComponents/CoverImage';
import { TotalRaisedAmount } from 'src/components/customComponents/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';

import HeartBtn from '../../../buttons/HeartButton';
import SwipeableLink from '../../../wrappers/SwipeableLink';
import styles from './styles.module.scss';

type Props = {
  item: any;
  isCharity?: boolean;
  horizontal?: boolean;
  path: string;
};

const ItemCard: FC<Props> = ({ item, horizontal, isCharity, path }) => {
  const { account } = useContext(UserAccountContext);
  const { showMessage, showError } = useShowNotification();
  const { isAuthenticated } = useAuth();
  const history = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const [follow, { loading: followLoading }] = useMutation(isCharity ? FollowCharity : FollowInfluencer);
  const [unfollow, { loading: unfollowLoading }] = useMutation(isCharity ? UnfollowCharity : UnfollowInfluencer);

  const followers = item?.followers;

  const [followed, setFollowed] = useState(() =>
    followers?.some((follower: any) => follower.user === account?.mongodbId),
  );

  const handleFollow = useCallback(async () => {
    if (!isAuthenticated) return RedirectWithReturnAfterLogin(history.location.pathname);

    try {
      await follow({ variables: { [isCharity ? 'charityId' : 'influencerId']: item.id } });
      showMessage('Successfully followed');
      setFollowed(true);
    } catch (error) {
      showError(error.message);
    }
  }, [
    item?.id,
    showMessage,
    showError,
    follow,
    isAuthenticated,
    history.location.pathname,
    isCharity,
    RedirectWithReturnAfterLogin,
  ]);

  const handleUnfollow = useCallback(async () => {
    try {
      await unfollow({ variables: { [isCharity ? 'charityId' : 'influencerId']: item.id } });
      showMessage('Successfully unfollowed');
      setFollowed(false);
    } catch (error) {
      showError(error.message);
    }
  }, [item?.id, isCharity, showMessage, showError, unfollow]);

  if (!item) return null;

  return (
    <figure className={clsx(styles.root, horizontal && styles.horizontalRoot, styles.horizontalOnMobileRoot)}>
      <div className={clsx(styles.wrapper)}>
        <HeartBtn
          className={clsx(styles.followBtn)}
          followHandler={handleFollow}
          followed={followed}
          loading={followLoading || unfollowLoading}
          unfollowHandler={handleUnfollow}
        />

        <SwipeableLink to={path}>
          <CoverImage
            alt="Auction image"
            className={clsx(styles.image, horizontal && styles.horizontalImage)}
            formatSize={194}
            src={item?.avatarUrl}
          />
        </SwipeableLink>
      </div>

      <figcaption className={clsx(styles.description, horizontal && styles.horizontalDescription)}>
        <SwipeableLink className={styles.link} title={item.name} to={path}>
          <p className={clsx(horizontal && styles.name, 'text-body')}>{item.name}</p>
        </SwipeableLink>
        <TotalRaisedAmount value={item.totalRaisedAmount} />
      </figcaption>
    </figure>
  );
};

export default ItemCard;
