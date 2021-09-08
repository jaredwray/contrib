import { FC, useContext, useCallback, useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/AuctionCard';
import Layout from 'src/components/Layout';
import { ProfileSliderRow } from 'src/components/ProfileSliderRow';
import { TotalRaisedAmount } from 'src/components/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import WatchBtn from 'src/components/WatchBtn';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { AuctionStatus, Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { FollowInfluencer, UnfollowInfluencer } from '../../../apollo/queries/influencers';
import AdminDropdown from './AdminDropdown';
import styles from './InfluencerProfilePageContent.module.scss';

interface Props {
  influencer: InfluencerProfile;
  totalRaisedAmount: Dinero.DineroObject;
}

export const InfluencerProfilePageContent: FC<Props> = ({ influencer, totalRaisedAmount }) => {
  const { addToast } = useToasts();
  const { account } = useContext(UserAccountContext);
  const { isAuthenticated } = useAuth0();
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

  const profileDescriptionParagraphs = (influencer.profileDescription ?? '').split('\n');

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
              {account?.isAdmin && (
                <AdminDropdown>
                  <Link
                    className={clsx(styles.dropdownItem, 'dropdown-item text-label float-right')}
                    to={`/assistants/${influencer.id}`}
                  >
                    Assistants
                  </Link>
                  <Link
                    className={clsx(styles.dropdownItem, 'dropdown-item text-label float-right')}
                    to={`/auctions/${influencer.id}/new`}
                  >
                    Create Auction
                  </Link>
                  <Link
                    className={clsx(styles.dropdownItem, 'dropdown-item text-label float-right')}
                    to={`/profiles/${influencer.id}/edit`}
                  >
                    Edit
                  </Link>
                </AdminDropdown>
              )}
            </Col>
          </Row>
        </Container>
        <div className={styles.header}>
          <Image roundedCircle className={styles.avatar} src={ResizedImageUrl(influencer.avatarUrl, 194)} />
        </div>

        <Container className={styles.content}>
          <Row>
            <Col md="6">
              <p className="text-headline break-word">{influencer.name}</p>
              <TotalRaisedAmount value={totalRaisedAmount} />
              {/*<div className="d-flex">
                <a
                  className={clsx(styles.socialIcon, 'mr-3')}
                  href="/"
                  rel="noreferrer noopener"
                  target="_blank"
                  title="twitter"
                >
                  <TwitterIcon />
                </a>
                <a className={styles.socialIcon} href="/" rel="noreferrer noopener" target="_blank" title="instagram">
                  <InstagramIcon />
                </a>
              </div>*/}
            </Col>
            <Col md="6">
              <span className="label-with-separator text-label">Player profile</span>
              {profileDescriptionParagraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text--body mb-4 mt-4 break-word">
                  {paragraph}
                </p>
              ))}
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
        <section className={styles.sliders}>
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
