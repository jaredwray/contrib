import { FC, useContext } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/AuctionCard';
import Layout from 'src/components/Layout';
import { ProfileSliderRow } from 'src/components/ProfileSliderRow';
import { TotalRaisedAmount } from 'src/components/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { AuctionStatus, Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './InfluencerProfilePageContent.module.scss';

interface Props {
  influencer: InfluencerProfile;
}

export const InfluencerProfilePageContent: FC<Props> = ({ influencer }) => {
  const { account } = useContext(UserAccountContext);
  const { data } = useQuery(AuctionsListQuery, {
    variables: {
      filters: {
        auctionOrganizer: influencer.id,
        status: [AuctionStatus.DRAFT, AuctionStatus.ACTIVE, AuctionStatus.SETTLED],
      },
    },
  });
  const auctions = data?.auctions?.items;

  const profileAuctions = profileAuctionsHash(auctions);

  const liveAuctions = profileAuctions.ACTIVE;
  const pastAuctions = profileAuctions.SETTLED;
  const draftAuctions = profileAuctions.DRAFT;

  const profileDescriptionParagraphs = (influencer.profileDescription ?? '').split('\n');

  const hasLiveAuctions = Boolean(liveAuctions.length);
  const hasPastAuctions = Boolean(pastAuctions.length);
  const hasDraftAuctions = Boolean(draftAuctions.length);

  const hasAuctions = hasLiveAuctions || hasPastAuctions || hasDraftAuctions;
  const isMyProfile = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(influencer.id);

  const liveAuctionsLayout = liveAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const draftAuctionsLayout = draftAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const pastAuctionsLayout = pastAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));

  return (
    <Layout>
      <section className={styles.root}>
        {isMyProfile && (
          <Container className="p-0">
            <Row>
              <Col className="p-0">
                <Link className={clsx(styles.editBtn, 'text-label btn btn-secondary')} to={'/profiles/me/edit'}>
                  Edit
                </Link>
              </Col>
            </Row>
          </Container>
        )}
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
            <Row>
              <Col>
                <Link className="text-label float-right" to={`/profiles/${influencer.id}/edit`}>
                  Edit
                </Link>
              </Col>
            </Row>
          </Container>
        )}
        <Container className={styles.content}>
          <Row>
            <Col md="6">
              <p className="text-headline break-word">{influencer.name}</p>
              <TotalRaisedAmount value={influencer.totalRaisedAmount} />
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
              <ProfileSliderRow items={liveAuctionsLayout}>{influencer.name}'s live auctions</ProfileSliderRow>
            )}
            {hasDraftAuctions && (account?.isAdmin || isMyProfile) && (
              <ProfileSliderRow items={draftAuctionsLayout}>{influencer.name}'s draft auctions</ProfileSliderRow>
            )}
            {hasPastAuctions && (
              <ProfileSliderRow items={pastAuctionsLayout}>{influencer.name}'s past auctions</ProfileSliderRow>
            )}
          </Container>
        </section>
      )}
    </Layout>
  );
};
