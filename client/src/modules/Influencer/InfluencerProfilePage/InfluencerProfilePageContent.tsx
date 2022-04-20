import { FC, useContext, useCallback, useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import { FollowInfluencer, UnfollowInfluencer } from 'src/apollo/queries/influencers';
import { ReadMore } from 'src/components/buttons/ReadMoreButton';
import WatchBtn from 'src/components/buttons/WatchBtn';
import { AuctionsInfoLoading } from 'src/components/custom/AuctionsStatusInfo/AuctionsInfoLoading';
import { ProfileAvatar } from 'src/components/custom/ProfileAvatar';
import { TotalRaisedAmount } from 'src/components/custom/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { AuctionStatus, Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { InfluencerAuctionsInfo } from './InfluencerAuctionsInfo';
import styles from './InfluencerProfilePageContent.module.scss';

interface Props {
  influencer: InfluencerProfile;
}

export const InfluencerProfilePageContent: FC<Props> = ({ influencer }) => {
  const { account } = useContext(UserAccountContext);
  const { showMessage, showError } = useShowNotification();
  const { isAuthenticated } = useAuth();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const [followed, setFollowed] = useState(() =>
    influencer?.followers?.some((follower) => follower.user === account?.mongodbId),
  );
  const [followersNumber, setFollowersNumber] = useState(influencer?.followers?.length || 0);
  const [draftAuctions, setDraftAuctions] = useState<Auction[]>([]);
  const { data: auctionsData, loading: isLoadingAuctions } = useQuery(AuctionsListQuery, {
    variables: {
      filters: {
        auctionOrganizer: influencer.id,
        status: [
          AuctionStatus.DRAFT,
          AuctionStatus.ACTIVE,
          AuctionStatus.SETTLED,
          AuctionStatus.STOPPED,
          AuctionStatus.SOLD,
        ],
      },
    },
    /* istanbul ignore next */
    onCompleted({ auctions }) {
      setDraftAuctions(profileAuctionsHash(auctions.items).DRAFT);
    },
  });
  const [followInfluencer, { loading: followLoading }] = useMutation(FollowInfluencer);
  const [unfollowInfluencer, { loading: unfollowLoading }] = useMutation(UnfollowInfluencer);

  const auctions = auctionsData?.auctions?.items || [];
  const isMyProfile = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(influencer.id);

  const handleFollowInfluencer = useCallback(async () => {
    if (!isAuthenticated) {
      RedirectWithReturnAfterLogin(`/profiles/${influencer.id}`);
      return;
    }

    try {
      await followInfluencer({ variables: { influencerId: influencer.id } });
      showMessage('Successfully followed');
      setFollowed(true);
      setFollowersNumber(followersNumber ? followersNumber + 1 : 1);
    } catch (error) {
      showError(error.message);
    }
  }, [
    influencer.id,
    followersNumber,
    isAuthenticated,
    RedirectWithReturnAfterLogin,
    followInfluencer,
    showMessage,
    showError,
  ]);

  const handleUnfollowInfluencer = useCallback(async () => {
    try {
      await unfollowInfluencer({ variables: { influencerId: influencer.id } });
      showMessage('Successfully unfollowed');
      setFollowed(false);
      setFollowersNumber(followersNumber - 1);
    } catch (error) {
      showError(error.message);
    }
  }, [influencer.id, followersNumber, unfollowInfluencer, showMessage, showError]);
  const onDelete = useCallback((auction: Auction) => {
    setDraftAuctions((prevState: Auction[]) => prevState.filter((draft) => draft !== auction));
  }, []);

  return (
    <Layout>
      <section className={styles.root}>
        <Container className="p-0" fluid="xxl">
          <Row className="position-relative">
            <Col className="p-0">
              {isMyProfile && (
                <Link className={clsx(styles.editBtn, 'text-label btn btn-secondary')} to={'/profiles/me/edit'}>
                  Edit
                </Link>
              )}
            </Col>
          </Row>
        </Container>
        <div className={styles.header}>
          <ProfileAvatar src={ResizedImageUrl(influencer.avatarUrl, 194)} />
        </div>
        <Container className={clsx(styles.content, 'mb-0 mb-md-3')}>
          <Row>
            <Col md="6">
              <p className="text-headline break-word">{influencer.name}</p>
              <TotalRaisedAmount value={influencer.totalRaisedAmount} />
              <div className="d-sm-block d-none">
                <WatchBtn
                  disabled={isMyProfile}
                  entityType="influencer"
                  followHandler={handleFollowInfluencer}
                  followed={followed}
                  followersNumber={followersNumber}
                  loading={followLoading || unfollowLoading}
                  unfollowHandler={handleUnfollowInfluencer}
                />
              </div>
            </Col>
            <Col md="6">
              <span className="label-with-separator text-label">Player profile</span>
              <ReadMore text={influencer?.profileDescription} />
            </Col>
            <Col className="d-block d-md-none">
              <WatchBtn
                disabled={isMyProfile}
                entityType="influencer"
                followHandler={handleFollowInfluencer}
                followed={followed}
                followersNumber={followersNumber}
                loading={followLoading || unfollowLoading}
                unfollowHandler={handleUnfollowInfluencer}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <section className={clsx(styles.sliders, 'pt-3 pb-5')}>
        {isLoadingAuctions ? (
          <Container className="px-3 pt-4">
            <AuctionsInfoLoading name={influencer.name} />
          </Container>
        ) : (
          <InfluencerAuctionsInfo
            auctions={auctions}
            draftAuctions={draftAuctions}
            influencer={influencer}
            isShowDraftAndStopped={account?.isAdmin || isMyProfile}
            onDeleteDraftAuctions={onDelete}
          />
        )}
      </section>
    </Layout>
  );
};
