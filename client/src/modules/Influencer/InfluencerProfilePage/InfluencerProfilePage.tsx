import { FC } from 'react';

import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { GetTotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { GetInfluencerQuery } from 'src/apollo/queries/influencers';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { InfluencerProfilePageContent } from './InfluencerProfilePageContent';

export const InfluencerProfilePage: FC = () => {
  const influencerId = useParams<{ influencerId?: string }>().influencerId ?? 'me';
  const history = useHistory();

  const { data } = useQuery<{ influencer: InfluencerProfile }>(GetInfluencerQuery, {
    variables: { id: influencerId },
  });

  const responce = useQuery(GetTotalRaisedAmountQuery, {
    variables: { influencerId },
  });

  const influencer = data?.influencer;

  if (influencer === null) {
    history.replace('/404');
    return null;
  }

  if (influencer === undefined) {
    return null;
  }
  const totalRaisedAmount = responce.data?.getTotalRaisedAmount.totalRaisedAmount;

  setPageTitle(`${influencerId === 'me' ? 'My' : `${influencer.name}'s`} Profile`);

  return <InfluencerProfilePageContent influencer={influencer} totalRaisedAmount={totalRaisedAmount} />;
};
