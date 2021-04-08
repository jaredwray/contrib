import { FC, useMemo, useContext } from 'react';

import Dinero from 'dinero.js';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AuctionCard from 'src/components/AuctionCard';
import Layout from 'src/components/Layout';
import Slider from 'src/components/Slider';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import VerifiedStatus from 'src/components/VerifiedStatus';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { AuctionStatus } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './InfluencerProfilePageContent.module.scss';

interface Props {
  influencer: InfluencerProfile;
  isOwnProfile: boolean;
}

export const InfluencerProfilePageContent: FC<Props> = ({ influencer, isOwnProfile }) => {
  const { account } = useContext(UserAccountContext);
  const totalRaised = useMemo(
    () =>
      (influencer.auctions ?? [])
        .filter((a) => a.status === AuctionStatus.SETTLED)
        .map((a) => Dinero(a.maxBid?.bid))
        .reduce((total, next) => total.add(next), Dinero({ amount: 0, currency: 'USD' })),
    [influencer],
  );

  const liveAuctions = useMemo(
    () =>
      (influencer.auctions ?? []).filter(
        (a) => a.status === AuctionStatus.ACTIVE || (a.status === AuctionStatus.DRAFT && isOwnProfile),
      ),
    [influencer, isOwnProfile],
  );

  const pastAuctions = useMemo(() => (influencer.auctions ?? []).filter((a) => a.status === AuctionStatus.SETTLED), [
    influencer,
  ]);

  const profileDescriptionParagraphs = (influencer.profileDescription ?? '').split('\n');

  const hasLiveAuctions = Boolean(liveAuctions.length);
  const hasPastAuctions = Boolean(pastAuctions.length);
  const hasAuctions = hasLiveAuctions || hasPastAuctions;
  const isMyProfile = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(influencer.id);

  const liveAuctionsLayout = liveAuctions.map((auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const pastAuctionsLayout = pastAuctions.map((auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));

  return (
    <Layout>
      <section className={styles.root}>
        <div className={styles.header}>
          <Image roundedCircle className={styles.avatar} src={ResizedImageUrl(influencer.avatarUrl, 194)} />
        </div>
        {account?.isAdmin && (
          <Container>
            <Row>
              <Col>
                <Link className="text-label float-right" to={`/auctions/${influencer.id}/new/basic`}>
                  Create Auction
                </Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <Link className="text-label float-right" to={`/assistants/${influencer.id}`}>
                  Assistants
                </Link>
              </Col>
            </Row>
          </Container>
        )}
        {(isMyProfile || account?.isAdmin) && (
          <Container>
            <Row>
              <Col>
                <Link className="text-label float-right" to={`/profiles/${isMyProfile ? 'me' : influencer.id}/edit`}>
                  Edit
                </Link>
              </Col>
            </Row>
          </Container>
        )}
        <Container className={styles.content}>
          <Row>
            <Col md="6">
              <VerifiedStatus />
              <p className="text-headline break-word">{influencer.name}</p>
              <p className="text-label text-all-cups">Total charity amount raised: {totalRaised.toFormat('$0,0')}</p>
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
        </Container>
      </section>

      {hasAuctions && (
        <section className={styles.sliders}>
          <Container>
            {hasLiveAuctions && (
              <div className="mb-5">
                <span className="label-with-separator text-label mb-4 d-block break-word">
                  {influencer.name} live auctions
                </span>
                <Slider items={liveAuctionsLayout} />
              </div>
            )}
            {hasPastAuctions && (
              <div>
                <span className="label-with-separator text-label mb-4 d-block ">{influencer.name} past auctions</span>
                <Slider items={pastAuctionsLayout} />
              </div>
            )}
          </Container>
        </section>
      )}
    </Layout>
  );
};
