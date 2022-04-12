import React from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Container, Row } from 'react-bootstrap';

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
    <Container fluid className={clsx(styles.root, 'overflow-hidden text-left p-4 pb-5')}>
      <Container className={clsx('p-0', !items.length && 'text-center')} fluid="xxl">
        <Row className="p-0 py-2">
          <span className={clsx(styles.subtitle, 'p-0 text-center text-md-start')}>
            Direct <span className={styles.italicSubtitle}>Influencer-To-Fan</span> Charity Auctions
          </span>
        </Row>
        {items.length ? (
          <Slider items={items} />
        ) : (
          <span className="col-lg-9 col-12">No auctions currently active</span>
        )}
      </Container>
    </Container>
  );
}
