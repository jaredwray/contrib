import { ReactElement } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Container, Col, Row } from 'react-bootstrap';

import { TotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { TopCharityQuery } from 'src/apollo/queries/charities';
import { TopEarnedInfluencerQuery } from 'src/apollo/queries/influencers';
import AwardIcon from 'src/assets/images/award.svg';
import TopCharityIcon from 'src/assets/images/top-charity.svg';
import TrophyIcon from 'src/assets/images/trophy.svg';

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
    <Container className={clsx(styles.badgesWrapper, 'd-flex flex-row justify-content-center py-2')}>
      <Row>
        <Col className="text-center p-4 py-md-2" md="auto">
          {totalRaised && (
            <TotalAmount
              firstValue="ALL TIME"
              icon={TrophyIcon}
              secondValue={Dinero({ amount: totalRaised }).toFormat('$0,0')}
              title="total raised"
            />
          )}
        </Col>
        <Col className={clsx(styles.topEarner, 'p-4 py-md-2')} md="auto">
          {topEarned && (
            <TotalAmount
              avatar={topEarned.avatarUrl}
              firstValue={topEarned.name}
              icon={AwardIcon}
              link={`/profiles/${topEarned.id}`}
              secondValue={Dinero(topEarned.totalRaisedAmount).toFormat('$0,0')}
              title="top earner"
            />
          )}
        </Col>
        <Col className="p-4 py-md-2" md="auto">
          {topCharity && (
            <TotalAmount
              avatar={topCharity.avatarUrl}
              firstValue={topCharity.name}
              icon={TopCharityIcon}
              link={`/charity/${topCharity.semanticId || topCharity.id}`}
              secondValue={Dinero(topCharity.totalRaisedAmount).toFormat('$0,0')}
              title="top charity"
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};
