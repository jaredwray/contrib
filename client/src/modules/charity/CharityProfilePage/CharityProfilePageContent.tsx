import { FC, useContext } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/AuctionCard';
import Layout from 'src/components/Layout';
import { ProfileSliderRow } from 'src/components/ProfileSliderRow';
import NotActiveStatus from 'src/components/statuses/NotActiveStatus';
import { TotalRaisedAmount } from 'src/components/TotalRaisedAmount';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { AuctionStatus, Auction } from 'src/types/Auction';
import { Charity, CharityStatus } from 'src/types/Charity';

import styles from './CharityProfilePageContent.module.scss';

interface Props {
  charity: Charity;
}

export const CharityProfilePageContent: FC<Props> = ({ charity }) => {
  const { account } = useContext(UserAccountContext);

  const { data } = useQuery(AuctionsListQuery, {
    variables: {
      filters: {
        charity: charity.id,
        status: [AuctionStatus.ACTIVE, AuctionStatus.SETTLED],
      },
    },
  });
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
        {isMyProfile && (
          <Container className="p-0">
            <Row>
              <Col className="p-0">
                <Link className={clsx(styles.editBtn, 'text-label btn btn-secondary')} to={'/charity/me/edit'}>
                  Edit
                </Link>
              </Col>
            </Row>
          </Container>
        )}
        <div className={styles.header}>
          <Image roundedCircle className={styles.avatar} src={ResizedImageUrl(charity?.avatarUrl || '', 194)} />
        </div>
        {account?.isAdmin && (
          <Container>
            <Row>
              <Col>
                <Link className="text-label float-right" to={`/charity/${charity.id}/edit`}>
                  Edit
                </Link>
              </Col>
            </Row>
          </Container>
        )}
        <Container className={styles.content}>
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
        </Container>
      </section>
      {hasAuctions && (
        <section className={styles.sliders}>
          <Container>
            {hasLiveAuctions && (
              <ProfileSliderRow items={liveAuctionCards}>Live auctions benefiting {charity.name}</ProfileSliderRow>
            )}
            {hasPastAuctions && (
              <ProfileSliderRow items={pastAuctionCards}>Past auctions benefiting {charity.name}</ProfileSliderRow>
            )}
          </Container>
        </section>
      )}
    </Layout>
  );
};
