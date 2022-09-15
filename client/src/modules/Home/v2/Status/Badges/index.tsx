import { ReactElement } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Container, Col, Row } from 'react-bootstrap';

import { TotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { TopCharityQuery } from 'src/apollo/queries/charities';
import { TopEarnedInfluencerQuery } from 'src/apollo/queries/influencers';

import styles from './styles.module.scss';
import { TotalAmount } from './TotalAmount';

export const Badges = (): ReactElement => {
  const { data: totalRaisedData } = useQuery(TotalRaisedAmountQuery);
  const { data: topEarnedData } = useQuery(TopEarnedInfluencerQuery);
  const { data: topCarityData } = useQuery(TopCharityQuery);

  const totalRaised = totalRaisedData?.totalRaisedAmount;
  const topEarned = topEarnedData?.topEarnedInfluencer;
  const topCharity = topCarityData?.topCharity;

  return (
    <Container className={clsx(styles.badgesWrapper, 'd-flex flex-row justify-content-center')}>
      <Row>
        <Col className={clsx(styles.item, 'text-center p-4 p-sm-3')} md="auto">
          <TotalAmount
            firstValue={totalRaised && Dinero({ amount: totalRaised }).toFormat('$0,0')}
            secondValue="ALL TIME"
            title="total raised"
          />
        </Col>
        <Col className={clsx(styles.item, styles.topEarner, 'p-4 p-sm-3')} md="auto">
          <TotalAmount
            avatar={topEarned?.avatarUrl}
            firstValue={topEarned && Dinero(topEarned.totalRaisedAmount).toFormat('$0,0')}
            link={topEarned && `/profiles/${topEarned.id}`}
            secondValue={topEarned?.name}
            title="top earner"
          />
        </Col>
        <Col className={clsx(styles.item, 'p-4 p-sm-3')} md="auto">
          <TotalAmount
            avatar={topCharity?.avatarUrl}
            firstValue={topCharity && Dinero(topCharity.totalRaisedAmount).toFormat('$0,0')}
            link={topCharity && `/charity/${topCharity.semanticId || topCharity.id}`}
            secondValue={topCharity?.name}
            title="top charity"
          />
        </Col>
        <Col className={clsx(styles.item, 'text-center p-4 p-sm-3')} md="auto">
          <TotalAmount firstValue="$5,000" secondValue="TOTAL MATCHED" title="CORPORATE SPONSORS" />
        </Col>
      </Row>
    </Container>
  );
};
