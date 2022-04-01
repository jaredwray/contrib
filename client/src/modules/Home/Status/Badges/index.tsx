import { ReactElement } from 'react';

import { useQuery } from '@apollo/client';
import Dinero from 'dinero.js';
import { Col } from 'react-bootstrap';

import { TotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { TopEarnedInfluencerQuery } from 'src/apollo/queries/influencers';
import awardIcon from 'src/assets/images/award.svg';
import trophyIcon from 'src/assets/images/trophy.svg';

import { TotalAmount } from './TotalAmount';

export const Badges = (): ReactElement => {
  const { data: totalRaisedData } = useQuery(TotalRaisedAmountQuery);
  const { data: topEarnedData } = useQuery(TopEarnedInfluencerQuery);

  const totalRaised = totalRaisedData?.totalRaisedAmount;
  const topEarned = topEarnedData?.topEarnedInfluencer;

  return (
    <>
      <Col className="p-0 pb-4 pb-md-0" lg="3" md="3" sm="6">
        {totalRaised && (
          <TotalAmount
            icon={trophyIcon}
            info="ALL TIME"
            title="total raised"
            value={Dinero({ amount: totalRaised }).toFormat('$0,0')}
          />
        )}
      </Col>
      <Col className="p-0" lg="3" md="3" sm="6">
        {topEarned && (
          <TotalAmount
            icon={awardIcon}
            info={Dinero(topEarned.totalRaisedAmount).toFormat('$0,0')}
            title="top earner"
            value={topEarned.name}
          />
        )}
      </Col>
    </>
  );
};
