import { ReactElement } from 'react';

import { useQuery } from '@apollo/client';
import Dinero from 'dinero.js';
import { Col } from 'react-bootstrap';

import { TotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { TopCharityQuery } from 'src/apollo/queries/charities';
import { TopEarnedInfluencerQuery } from 'src/apollo/queries/influencers';
import AwardIcon from 'src/assets/images/award.svg';
import TopCharityIcon from 'src/assets/images/top-charity.svg';
import TrophyIcon from 'src/assets/images/trophy.svg';

import { TotalAmount } from './TotalAmount';

export const Badges = (): ReactElement => {
  const { data: totalRaisedData } = useQuery(TotalRaisedAmountQuery);
  const { data: topEarnedData } = useQuery(TopEarnedInfluencerQuery);
  const { data: topCarityData } = useQuery(TopCharityQuery);

  const totalRaised = totalRaisedData?.totalRaisedAmount;
  const topEarned = topEarnedData?.topEarnedInfluencer;
  const topCharity = topCarityData?.topCharity;

  return (
    <>
      <Col className="text-center px-0 py-lg-0" md="4">
        {totalRaised && (
          <TotalAmount
            firstValue={Dinero({ amount: totalRaised }).toFormat('$0,0')}
            icon={TrophyIcon}
            secondValue="all time"
            title="total raised"
          />
        )}
      </Col>
      <Col className="p-0" md="4">
        {topEarned && (
          <TotalAmount
            firstValue={topEarned.name}
            icon={AwardIcon}
            link={`/profiles/${topEarned.id}`}
            secondValue={Dinero(topEarned.totalRaisedAmount).toFormat('$0,0')}
            title="top earner"
          />
        )}
      </Col>
      <Col className="p-0 pb-4" md="4">
        {topCharity && (
          <TotalAmount
            firstValue={topCharity.name}
            icon={TopCharityIcon}
            link={`/charity/${topCharity.semanticId || topCharity.id}`}
            secondValue={Dinero(topCharity.totalRaisedAmount).toFormat('$0,0')}
            title="top charity"
          />
        )}
      </Col>
    </>
  );
};
