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

interface Props {
  selectedAuction: string;
}

export default function SimilarAuctions({ selectedAuction }: Props) {
  const { loading, data, error } = useQuery(AuctionsListQuery, {
    variables: {
      size: 10,
      skip: 0,
      filters: {
        status: [AuctionStatus.ACTIVE],
        selectedAuction,
      },
    },
  });

  if (loading || error) {
    return null;
  }

  const items = data.auctions.items.map((auction: Auction, i: number) => <AuctionCard key={i} auction={auction} />);

  return (
    <section className={styles.root}>
      <Container className={clsx(styles.homepageContainer, 'header')} fluid="xxl">
        <Row className="pb-3 pb-md-4 text-center">
          <Col className={clsx(styles.title, 'pb-3 pb-md-3 pb-lg-0')}>Similar Auctions</Col>
        </Row>
        {items.length ? <Slider items={items} /> : <span className="col-lg-9 col-12">No active auctions</span>}
        <Row className="pt-4 text-center">
          <Col className="align-self-end pe-lg-0">
            <Link className={clsx('text--body', styles.seeAllLink)} to="/auctions">
              View Auctions
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
