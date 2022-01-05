import { FC, useContext, useCallback, useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import { FollowCharity, UnfollowCharity } from 'src/apollo/queries/charityProfile';
import { ReadMore } from 'src/components/buttons/ReadMoreButton';
import WatchBtn from 'src/components/buttons/WatchBtn';
import { AuctionsInfoLoading } from 'src/components/customComponents/AuctionsStatusInfo/AuctionsInfoLoading';
import { ProfileAvatar } from 'src/components/customComponents/ProfileAvatar';
import { TotalRaisedAmount } from 'src/components/customComponents/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import NotActiveStatus from 'src/components/statuses/NotActiveStatus';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { AuctionStatus } from 'src/types/Auction';
import { Charity, CharityStatus } from 'src/types/Charity';

import { CharityAuctionsInfo } from './CharityAuctionsInfo';
import styles from './CharityProfilePageContent.module.scss';

interface Props {
  charity: Charity;
}

export const CharityProfilePageContent: FC<Props> = ({ charity }) => {
  const { account } = useContext(UserAccountContext);

  const history = useHistory();
  const { showMessage, showError } = useShowNotification();
  const { isAuthenticated } = useAuth();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const { data, loading: isLoadingAuctions } = useQuery(AuctionsListQuery, {
    variables: {
      filters: {
        charity: charity.id,
        status: [AuctionStatus.ACTIVE, AuctionStatus.SETTLED],
      },
    },
  });

  const [followCharity, { loading: followLoading }] = useMutation(FollowCharity);
  const [unfollowCharity, { loading: unfollowLoading }] = useMutation(UnfollowCharity);

  const [followed, setFollowed] = useState(() =>
    charity?.followers?.some((follower) => follower.user === account?.mongodbId),
  );
  const [followersNumber, setFollowersNumber] = useState(charity?.followers?.length || 0);

  const handleFollowCharity = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await followCharity({ variables: { charityId: charity.id } });
        showMessage('Successfully followed');
        setFollowed(true);
        setFollowersNumber(followersNumber ? followersNumber + 1 : 1);
      } catch (error) {
        showError(error.message);
      }
      return;
    }
    RedirectWithReturnAfterLogin(`/charity/${charity.id}`);
  }, [
    charity.id,
    followersNumber,
    isAuthenticated,
    followCharity,
    RedirectWithReturnAfterLogin,
    showMessage,
    showError,
  ]);

  const handleUnfollowCharity = useCallback(async () => {
    try {
      await unfollowCharity({ variables: { charityId: charity.id } });
      showMessage('Successfully unfollowed');
      setFollowed(false);
      setFollowersNumber(followersNumber - 1);
    } catch (error) {
      showError(error.message);
    }
  }, [charity.id, followersNumber, unfollowCharity, showMessage, showError]);

  const auctions = data?.auctions?.items ?? [];
  const isMyProfile = account?.charity?.id === charity.id;
  const isActive = charity.status === CharityStatus.ACTIVE;

  if (!isActive && !isMyProfile && !account?.isAdmin) {
    history.replace('/');
    return null;
  }

  return (
    <Layout>
      <section className={styles.root}>
        {(isMyProfile || account?.isAdmin) && (
          <Container className="p-0">
            <Row>
              <Col className="p-0">
                <Link
                  className={clsx(styles.editBtn, 'text-label btn btn-secondary')}
                  to={'/charity/' + (isMyProfile ? 'me' : charity.id) + '/edit'}
                >
                  Edit
                </Link>
              </Col>
            </Row>
          </Container>
        )}
        <div className={styles.header}>
          <ProfileAvatar src={ResizedImageUrl(charity?.avatarUrl || '', 194)} />
        </div>
        <Container className={clsx(styles.content, 'mb-5')}>
          <Row>
            <Col md="6">
              {!isActive && <NotActiveStatus />}
              <p className="text-headline break-word">{charity.name}</p>
              <TotalRaisedAmount value={charity.totalRaisedAmount} />
              {charity.website && (
                <p className="text-label text-all-cups">
                  <a className={styles.link} href={charity.websiteUrl}>
                    {charity.website}&#160;&gt;&gt;
                  </a>
                </p>
              )}
              <div className="d-sm-block d-none">
                <WatchBtn
                  disabled={isMyProfile || !isActive}
                  entityType="charity"
                  followHandler={handleFollowCharity}
                  followed={followed}
                  followersNumber={followersNumber}
                  loading={followLoading || unfollowLoading}
                  unfollowHandler={handleUnfollowCharity}
                />
              </div>
            </Col>
            <Col md="6">
              <span className="label-with-separator text-label">Charity profile</span>
              <ReadMore text={charity?.profileDescription} />
            </Col>
            <Col className="d-block d-md-none">
              <WatchBtn
                disabled={isMyProfile || !isActive}
                entityType="charity"
                followHandler={handleFollowCharity}
                followed={followed}
                followersNumber={followersNumber}
                loading={followLoading || unfollowLoading}
                unfollowHandler={handleUnfollowCharity}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <section className={clsx(styles.sliders, 'pt-4 pt-md-5 pb-4 p-md-5')}>
        <Container>
          {isLoadingAuctions ? (
            <AuctionsInfoLoading name={charity.name} />
          ) : (
            <CharityAuctionsInfo auctions={auctions} name={charity.name} />
          )}
        </Container>
      </section>
    </Layout>
  );
};
