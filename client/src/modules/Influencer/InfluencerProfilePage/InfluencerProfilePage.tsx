import { FC } from 'react';

import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { GetTotalRaisedAmount } from 'src/apollo/queries/auctions';
import { GetInfluencerQuery } from 'src/apollo/queries/influencers';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { InfluencerProfilePageContent } from './InfluencerProfilePageContent';

export const InfluencerProfilePage: FC = () => {
  const influencerId = useParams<{ influencerId?: string }>().influencerId ?? 'me';

  const { data } = useQuery<{ influencer: InfluencerProfile }>(GetInfluencerQuery, {
    variables: { id: influencerId },
  });

  const responce = useQuery(GetTotalRaisedAmount, {
    variables: { influencerId },
  });

  const influencer = data?.influencer;
  if (!influencer) {
    return null;
  }
  const totalRaisedAmount = responce.data?.getTotalRaisedAmount.totalRaisedAmount;

  setPageTitle(`${influencerId === 'me' ? 'My' : `${influencer.name}'s`} Profile`);

  return <InfluencerProfilePageContent influencer={influencer} totalRaisedAmount={totalRaisedAmount} />;
};
