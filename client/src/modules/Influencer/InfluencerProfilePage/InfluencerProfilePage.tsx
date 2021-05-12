import { FC } from 'react';

import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { GetInfluencerQuery } from 'src/apollo/queries/influencers';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import { InfluencerProfilePageContent } from './InfluencerProfilePageContent';

export const InfluencerProfilePage: FC = () => {
  const influencerId = useParams<{ influencerId?: string }>().influencerId ?? 'me';

  const { data } = useQuery<{ influencer: InfluencerProfile }>(GetInfluencerQuery, {
    variables: { id: influencerId },
  });

  const influencer = data?.influencer;
  if (!influencer) {
    return null;
  }

  return <InfluencerProfilePageContent influencer={influencer} isOwnProfile={influencerId === 'me'} />;
};
