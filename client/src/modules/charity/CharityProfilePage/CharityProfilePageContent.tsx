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
import NotActiveStatus from 'src/components/statuses/NotActiveStatus';
import { TotalRaisedAmount } from 'src/components/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import WatchBtn from 'src/components/WatchBtn';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { AuctionStatus, Auction } from 'src/types/Auction';
import { Charity, CharityStatus } from 'src/types/Charity';

import { FollowCharity, UnfollowCharity } from '../../../apollo/queries/charityProfile';
import styles from './CharityProfilePageContent.module.scss';

interface Props {
  charity: Charity;
  totalRaisedAmount: Dinero.DineroObject;
}

export const CharityProfilePageContent: FC<Props> = ({ charity, totalRaisedAmount }) => {
  const { addToast } = useToasts();
  const { account } = useContext(UserAccountContext);
  const { isAuthenticated } = useAuth0();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const { data } = useQuery(AuctionsListQuery, {
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
        addToast('Successfully followed', { autoDismiss: true, appearance: 'success' });
        setFollowed(true);
        setFollowersNumber(followersNumber ? followersNumber + 1 : 1);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'warning' });
      }
      return;
    }
    RedirectWithReturnAfterLogin(`/charity/${charity.id}`);
  }, [charity.id, addToast, followCharity, followersNumber, isAuthenticated, RedirectWithReturnAfterLogin]);

  const handleUnfollowCharity = useCallback(async () => {
    try {
      await unfollowCharity({ variables: { charityId: charity.id } });
      addToast('Successfully unfollowed', { autoDismiss: true, appearance: 'success' });
      setFollowed(false);
      setFollowersNumber(followersNumber - 1);
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'warning' });
    }
  }, [charity.id, addToast, unfollowCharity, followersNumber]);

  const auctions = data?.auctions?.items ?? [];

  const profileDescriptionParagraphs = (charity?.profileDescription ?? 'no description').split('\n');

  const isMyProfile = account?.charity?.id === charity.id;
  const isActive = charity.status === CharityStatus.ACTIVE;

  if (!isActive && !isMyProfile && !account?.isAdmin) {
    return null;
  }

  const profileAuctions = profileAuctionsHash(auctions);

  const liveAuctions = profileAuctions.ACTIVE;
  const pastAuctions = profileAuctions.SETTLED;

  const hasLiveAuctions = Boolean(liveAuctions.length);
  const hasPastAuctions = Boolean(pastAuctions.length);

  const hasAuctions = Boolean(auctions.length);

  const liveAuctionCards = liveAuctions.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction} />);
  const pastAuctionCards = pastAuctions.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction} />);

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
          <Image roundedCircle className={styles.avatar} src={ResizedImageUrl(charity?.avatarUrl || '', 194)} />
        </div>
        <Container className={styles.content}>
          <Row>
            <Col md="6">
              {!isActive && <NotActiveStatus />}
              <p className="text-headline break-word">{charity.name}</p>
              <TotalRaisedAmount value={totalRaisedAmount} />
              {charity.website && (
                <p className="text-label text-all-cups">
                  <a className={styles.link} href={charity.websiteUrl}>
                    {charity.website}&#160;&gt;&gt;
                  </a>
                </p>
              )}
            </Col>
            <Col md="6">
              <span className="label-with-separator text-label">Charity profile</span>
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
      {hasAuctions && (
        <section className={styles.sliders}>
          <Container>
            {hasLiveAuctions && (
              <ProfileSliderRow items={liveAuctionCards}>Live auctions benefiting {charity.name}</ProfileSliderRow>
            )}
            {hasPastAuctions && (
              <ProfileSliderRow items={pastAuctionCards}>Ended auctions benefiting {charity.name}</ProfileSliderRow>
            )}
          </Container>
        </section>
      )}
    </Layout>
  );
};
