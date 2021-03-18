import React, { FC } from 'react';

import clsx from 'clsx';
import { Col, Container, Image, Row } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';

import instagramIcon from 'src/assets/images/instagram.webp';
import twitterIcon from 'src/assets/images/twitter.webp';
import Layout from 'src/components/Layout';
import Slider from 'src/components/Slider';
import TruncateText from 'src/components/TruncateText';
import VerifiedStatus from 'src/components/VerifiedStatus';
import AuctionPreview from 'src/modules/Home/EndingSoon/AuctionPreview';

import styles from './styles.module.scss';

interface Props {}

const AthleteProfilePage: FC<Props> = () => {
  // const { influencerId } = useParams<{ influencerId: string }>();

  const items = [...Array(10)].map((e: number, i: number) => <AuctionPreview key={i} auction={null} />);

  return (
    <Layout>
      <section className={styles.root}>
        <div className={styles.header}>
          <Image roundedCircle className={styles.avatar} src="/content/img/auctions/auction-item-1.webp" />
        </div>
        <Container className={styles.content}>
          <Row>
            <Col>
              <VerifiedStatus />
              <p className="text-headline">Diego Rossi</p>
              <p className="text-label text-all-cups">Total charity amount raised: --------</p>
              <div>
                <a className={clsx('d-inline-block', styles.socialIcon)} href="/" rel="external" title="twitter">
                  <img alt="twitter" className="" src={twitterIcon} />
                </a>
                <a className="d-inline-block" href="/" rel="external" title="instagram">
                  <img alt="instagram" className="" src={instagramIcon} />
                </a>
              </div>
            </Col>
            <Col>
              <span className="label-with-separator text-label">Player profile</span>
              <p className="text--body mb-0">
                <TruncateText withMoreButton lines={8}>
                  Rossi entered the Peñarol youth system at 12-years old and led the U-17 club to the league title.
                  Rossi made his first team regular season debut on April 29, 2016 and scored his first goal five days
                  later. He made 47 total appearances with the Peñarol first team, scoring 13 goals in all matches,
                  including the Copa Libertadores, South America’s premier club competition. Rossi is a young and
                  exciting player who has been a champion in his home country of Uruguay. A dangerous attacking weapon
                  in almost any position, he was a key contributor immediately in LAFC's inaugural season with 12 goals
                  and nine assists in 30 starts. He was even more lethal in 2019 with 16 goals and seven assists in 33
                  starts.
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
            <Slider items={items} />
          </div>
          <div>
            <span className="label-with-separator text-label mb-4 d-block">Diego’s past auctions</span>
            <Slider items={items} />
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default AthleteProfilePage;
