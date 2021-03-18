import React from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/AuctionCard';
import Slider from 'src/components/Slider';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

export default function SimilarAuctions() {
  const { loading, data, error } = useQuery(AuctionsListQuery, {
    variables: {
      size: 10,
      skip: 0,
    },
  });

  if (loading || error) {
    return null;
  }

  const items = data.auctions.items.map((auction: Auction, i: number) => <AuctionCard key={i} auction={auction} />);

  return (
    <section className={styles.endingSoon}>
      <Container className={clsx(styles.homepageContainer, 'header')}>
        <Row className="pb-1 pb-md-5">
          <Col className="text-super" lg="9" xs="12">
            Similar auctions
          </Col>
          <Col className="align-self-end pr-lg-0 ml-1 ml-lg-0" lg="3" xs="12">
            <Link className={clsx('float-lg-right text-label text-all-cups', styles.seeAllLink)} to="/auctions">
              See all auctions &gt;&gt;
            </Link>
          </Col>
        </Row>
        <Slider items={items} />
      </Container>
    </section>
  );
}
