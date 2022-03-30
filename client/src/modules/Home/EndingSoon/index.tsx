import React from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/customComponents/AuctionCard';
import Slider from 'src/components/customComponents/Slider';
import { Auction, AuctionStatus } from 'src/types/Auction';

import styles from './styles.module.scss';

export default function EndingSoon() {
  const { loading, data, error } = useQuery(AuctionsListQuery, {
    variables: {
      filters: {
        status: [AuctionStatus.ACTIVE],
      },
    },
  });

  if (loading || error) return null;

  const items = data.auctions.items.map((auction: Auction, i: number) => <AuctionCard key={i} auction={auction} />);

  return (
    <section className={styles.root}>
      <Container fluid="xxl">
        {items.length ? <Slider items={items} /> : <span className="col-lg-9 col-12">No active auctions</span>}
        <Row className="mt-4">
          <Col className="text-center">
            <Link className={styles.seeAllLink} to="/auctions">
              View all auctions
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
