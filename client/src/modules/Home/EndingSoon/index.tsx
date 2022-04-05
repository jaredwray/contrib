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
    <Container fluid className={clsx(styles.root, 'overflow-hidden pt-4')}>
      <Container className={clsx('p-0', !items.length && 'text-center')} fluid="xxl">
        <Row className="p-0 text-center">
          <span className={clsx(styles.subtitle, 'd-inline-block m-auto pt-2 pb-4')}>
            &nbsp; Direct <span className={styles.italicSubtitle}>Influencer-To-Fan</span> Charity Auctions
          </span>
        </Row>
        {items.length ? (
          <Slider items={items} />
        ) : (
          <span className="col-lg-9 col-12">No auctions currently active</span>
        )}
        <Row className="mt-4">
          <Col className="text-center">
            <Link className={clsx(styles.link, 'text--body')} to="/auctions">
              View Auctions
            </Link>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
