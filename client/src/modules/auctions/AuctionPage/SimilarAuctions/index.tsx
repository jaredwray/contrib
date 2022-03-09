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
      <Container className={clsx(styles.homepageContainer, 'header')}>
        <Row className="pb-3 pb-md-4">
          <Col className={clsx(styles.title, 'text-super pb-3 pb-md-3 pb-lg-0')} lg="8" xs="12">
            Similar auctions
          </Col>
          <Col className="align-self-end pe-lg-0" lg="4" xs="12">
            <Link
              className={clsx('float-lg-end text-subhead text-all-cups ms-1 ms-md-0', styles.seeAllLink)}
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
