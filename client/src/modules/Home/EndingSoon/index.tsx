import React from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/AuctionCard';
import Slider from 'src/components/Slider';
import { Auction, AuctionStatus } from 'src/types/Auction';

import styles from './styles.module.scss';

export default function EndingSoon() {
  const { loading, data, error } = useQuery(AuctionsListQuery, {
    variables: {
      size: 10,
      skip: 0,
      filters: {
        status: [AuctionStatus.ACTIVE],
      },
    },
  });

  if (loading || error) {
    return null;
  }
  const items = data.auctions.items.map((auction: Auction, i: number) => <AuctionCard key={i} auction={auction} />);

  return (
    <section className={styles.root}>
      <Container className={clsx(styles.homepageContainer, 'header')}>
        <Row className="pb-2 pb-sm-3 pb-lg-5">
          <Col className={clsx(styles.title, 'text-super')} lg="9" xs="12">
            Ending soon
          </Col>
          <Col className="align-self-end pr-lg-0" lg="3" xs="12">
            <Link
              className={clsx('float-lg-right text-label text-all-cups ml-1 ml-md-0', styles.seeAllLink)}
              to="/auctions"
            >
              See all auctions &gt;&gt;
            </Link>
          </Col>
        </Row>
        {items.length ? <Slider items={items} /> : <span className="col-lg-9 col-12">No active auctions</span>}
      </Container>
    </section>
  );
}
