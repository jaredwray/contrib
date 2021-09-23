import { FC, useCallback, useState, useContext } from 'react';

import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { FollowCharity, UnfollowCharity } from 'src/apollo/queries/charityProfile';
import { FollowInfluencer, UnfollowInfluencer } from 'src/apollo/queries/influencers';
import CoverImage from 'src/components/CoverImage';
import { TotalRaisedAmount } from 'src/components/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';

import HeartBtn from '../HeartButton';
import SwipeableLink from '../SwipeableLink';
import styles from './styles.module.scss';

type Props = {
  item: any;
  isCharity?: boolean;
  horizontal?: boolean;
};

const ItemCard: FC<Props> = ({ item, horizontal, isCharity }) => {
  const { account } = useContext(UserAccountContext);
  const { addToast } = useToasts();
  const { isAuthenticated } = useAuth0();
  const hisory = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const [follow, { loading: followLoading }] = useMutation(isCharity ? FollowCharity : FollowInfluencer);
  const [unfollow, { loading: unfollowLoading }] = useMutation(isCharity ? UnfollowCharity : UnfollowInfluencer);

  const followers = item?.followers;
  const loading = followLoading || unfollowLoading;
  const isOwner = isCharity
    ? account?.charity?.id.includes(item?.id)
    : [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(item?.id);

  const [followed, setFollowed] = useState(() =>
    followers?.some((follower: any) => follower.user === account?.mongodbId),
  );

  const handleFollow = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await follow({ variables: { [isCharity ? 'charityId' : 'influencerId']: item.id } });
        addToast('Successfully followed', { autoDismiss: true, appearance: 'success' });
        setFollowed(true);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'warning' });
      }
      return;
    }

    RedirectWithReturnAfterLogin(hisory.location.pathname);
  }, [item?.id, addToast, follow, isAuthenticated, hisory.location.pathname, isCharity, RedirectWithReturnAfterLogin]);

  const handleUnfollow = useCallback(async () => {
    try {
      await unfollow({ variables: { [isCharity ? 'charityId' : 'influencerId']: item.id } });
      addToast('Successfully unfollowed', { autoDismiss: true, appearance: 'success' });
      setFollowed(false);
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'warning' });
    }
  }, [item?.id, isCharity, addToast, unfollow]);

  if (!item) {
    return null;
  }
  const linkToAuction = `/${isCharity ? 'charity' : 'profiles'}/${item?.id}`;

  return (
    <figure className={clsx(styles.root, horizontal && styles.horizontalRoot, styles.horizontalOnMobileRoot)}>
      <div className={clsx(styles.wrapper)}>
        <HeartBtn
          className={clsx(styles.followBtn)}
          disabled={isOwner}
          followHandler={handleFollow}
          followed={followed}
          loading={loading}
          unfollowHandler={handleUnfollow}
        />

        <SwipeableLink to={linkToAuction}>
          <CoverImage
            alt="Auction image"
            className={clsx(styles.image, horizontal && styles.horizontalImage)}
            formatSize={194}
            src={item?.avatarUrl}
          />
        </SwipeableLink>
      </div>

      <figcaption className={clsx(styles.description, horizontal && styles.horizontalDescription)}>
        <SwipeableLink className={styles.link} title={item.name} to={linkToAuction}>
          <p className={clsx(horizontal && styles.name, 'text-body')}>{item.name}</p>
        </SwipeableLink>
        <TotalRaisedAmount value={item.totalRaisedAmount} />
      </figcaption>
    </figure>
  );
};

export default ItemCard;
