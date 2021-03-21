import React, { FC } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { getInfluencersById } from 'src/apollo/queries/influencers';
import InstagramIcon from 'src/assets/images/Instagram';
import TwitterIcon from 'src/assets/images/Twitter';
import AuctionCard from 'src/components/AuctionCard';
import Layout from 'src/components/Layout';
import Slider from 'src/components/Slider';
import TruncateText from 'src/components/TruncateText';
import VerifiedStatus from 'src/components/VerifiedStatus';
import { Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './styles.module.scss';

interface Props {}

interface QueryData {
  influencer: InfluencerProfile;
}

const AthleteProfilePage: FC<Props> = () => {
  const { influencerId } = useParams<{ influencerId: string }>();

  const { loading, data, error } = useQuery<QueryData, { id: string }>(getInfluencersById, {
    variables: {
      id: influencerId,
    },
  });

  const { name, profileDescription, auctions, avatarUrl } = data?.influencer;

  const items = auctions.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction} />);

  return (
    <Layout>
      <section className={styles.root}>
        <div className={styles.header}>
          <Image roundedCircle className={styles.avatar} src={avatarUrl} />{' '}
        </div>
        <Container className={styles.content}>
          <Row>
            <Col>
              <VerifiedStatus />
              <p className="text-headline">{name}</p>
              <p className="text-label text-all-cups">Total charity amount raised: --------</p>
              <div className="d-flex">
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
              </div>
            </Col>
            <Col>
              <span className="label-with-separator text-label">Player profile</span>
              <p className="text--body mb-0">
                <TruncateText withMoreButton lines={5}>
                  {profileDescription}
                </TruncateText>
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className={styles.sliders}>
        <Container>
          <div className="mb-5">
            <span className="label-with-separator text-label mb-4 d-block">Diego’s live auctions</span>
            {/* <Slider items={items} /> */}
          </div>
          <div>
            <span className="label-with-separator text-label mb-4 d-block">Diego’s past auctions</span>
            {/* <Slider items={items} /> */}
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default AthleteProfilePage;
