import { FC, useContext, useCallback, useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import { ReadMore } from 'src/components/buttons/ReadMoreButton';
import WatchBtn from 'src/components/buttons/WatchBtn';
import AuctionCard from 'src/components/customComponents/AuctionCard';
import { ProfileAvatar } from 'src/components/customComponents/ProfileAvatar';
import { TotalRaisedAmount } from 'src/components/customComponents/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { ProfileSliderRow } from 'src/components/wrappers/ProfileSliderRow';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { AuctionStatus, Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { FollowInfluencer, UnfollowInfluencer } from '../../../apollo/queries/influencers';
import styles from './InfluencerProfilePageContent.module.scss';

interface Props {
  influencer: InfluencerProfile;
}

export const InfluencerProfilePageContent: FC<Props> = ({ influencer }) => {
  const { addToast } = useToasts();
  const { account } = useContext(UserAccountContext);
  const { isAuthenticated } = useAuth();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const [followed, setFollowed] = useState(() =>
    influencer?.followers?.some((follower) => follower.user === account?.mongodbId),
  );
  const [followersNumber, setFollowersNumber] = useState(influencer?.followers?.length || 0);

  const { data } = useQuery(AuctionsListQuery, {
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

  const handleFollowInfluencer = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await followInfluencer({ variables: { influencerId: influencer.id } });
        addToast('Successfully followed', { autoDismiss: true, appearance: 'success' });
        setFollowed(true);
        setFollowersNumber(followersNumber ? followersNumber + 1 : 1);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'warning' });
      }
      return;
    }

    RedirectWithReturnAfterLogin(`/profiles/${influencer.id}`);
  }, [influencer.id, addToast, followInfluencer, followersNumber, isAuthenticated, RedirectWithReturnAfterLogin]);

  const handleUnfollowInfluencer = useCallback(async () => {
    try {
      await unfollowInfluencer({ variables: { influencerId: influencer.id } });
      addToast('Successfully unfollowed', { autoDismiss: true, appearance: 'success' });
      setFollowed(false);
      setFollowersNumber(followersNumber - 1);
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'warning' });
    }
  }, [influencer.id, addToast, unfollowInfluencer, followersNumber]);

  const auctions = data?.auctions?.items;
  const profileAuctions = profileAuctionsHash(auctions);
  const liveAuctions = profileAuctions.ACTIVE;
  const pastAuctions = profileAuctions.SETTLED.concat(profileAuctions.SOLD);
  const [draftAuctions, setDraftAuctions] = useState<Auction[]>([]);
  const stoppedAuctions = profileAuctions.STOPPED;

  const isMyProfile = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(influencer.id);

  const onDelete = useCallback((auction: Auction) => {
    setDraftAuctions((prevState: Auction[]) => prevState.filter((draft) => draft !== auction));
  }, []);

  const liveAuctionsLayout = liveAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const draftAuctionsLayout = draftAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} onDelete={onDelete} />
  ));
  const stoppedAuctionsLayout = stoppedAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const pastAuctionsLayout = pastAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));

  return (
    <Layout>
      <section className={styles.root}>
        <Container className="p-0">
          <Row>
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

        <Container className={styles.content}>
          <Row>
            <Col md="6">
              <p className="text-headline break-word">{influencer.name}</p>
              <TotalRaisedAmount value={influencer.totalRaisedAmount} />
            </Col>
            <Col md="6">
              <span className="label-with-separator text-label">Player profile</span>
              <ReadMore text={influencer?.profileDescription} />
            </Col>
          </Row>
          <Row>
            <Col>
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

      {Boolean(auctions?.length) && (
        <section className={clsx(styles.sliders, 'pt-4 pt-md-5')}>
          <Container>
            {Boolean(liveAuctions.length) && (
              <ProfileSliderRow items={liveAuctionsLayout}>{influencer.name}'s live auctions</ProfileSliderRow>
            )}
            {(account?.isAdmin || isMyProfile) && (
              <>
                {Boolean(draftAuctions.length) && (
                  <ProfileSliderRow items={draftAuctionsLayout}>{influencer.name}'s draft auctions</ProfileSliderRow>
                )}
                {Boolean(stoppedAuctions.length) && (
                  <ProfileSliderRow items={stoppedAuctionsLayout}>
                    {influencer.name}'s stopped auctions
                  </ProfileSliderRow>
                )}
              </>
            )}

            {Boolean(pastAuctions.length) && (
              <ProfileSliderRow items={pastAuctionsLayout}>{influencer.name}'s ended auctions</ProfileSliderRow>
            )}
          </Container>
        </section>
      )}
    </Layout>
  );
};
