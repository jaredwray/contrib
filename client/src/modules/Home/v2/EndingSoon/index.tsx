import { FC } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Container, Row } from 'react-bootstrap';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/custom/AuctionCard';
import Slider from 'src/components/custom/Slider';
import { Auction, AuctionStatus } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  charity: any;
}

const EndingSoon: FC<Props> = ({ charity }) => {
  const { loading, data, error } = useQuery(AuctionsListQuery, {
    variables: {
      size: 25,
      orderBy: 'ENDING_SOON',
      filters: {
        charity: charity.id,
        status: [AuctionStatus.ACTIVE, AuctionStatus.SETTLED, AuctionStatus.SOLD],
      },
    },
  });

  if (loading || error) return null;
  // console.log(data.auctions.items);
  const items = data.auctions?.items?.map((auction: Auction, i: number) => <AuctionCard key={i} auction={auction} />);

  return (
    <Container fluid className={clsx(styles.root, 'overflow-hidden text-left p-3')}>
      <Container className={clsx('p-0', !items.length && 'text-center')} fluid="xxl">
        <Row className="p-0 pb-4">
          <span className={clsx(styles.subtitle, 'p-0 text-center text-md-start')}>{charity.name}</span>
        </Row>
        {items.length ? (
          <Slider items={items} />
        ) : (
          <span className="col-lg-9 col-12">No auctions currently active</span>
        )}
      </Container>
    </Container>
  );
};

export default EndingSoon;
