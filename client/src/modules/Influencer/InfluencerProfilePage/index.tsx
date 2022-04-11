import { FC } from 'react';

import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { GetInfluencerQuery } from 'src/apollo/queries/influencers';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import Content from './Content';

export const InfluencerProfilePage: FC = () => {
  const influencerId = useParams<{ influencerId?: string }>().influencerId ?? 'me';
  const history = useHistory();

  const { data } = useQuery<{ influencer: InfluencerProfile }>(GetInfluencerQuery, {
    variables: { id: influencerId },
  });

  const influencer = data?.influencer;

  if (influencer === null) {
    history.replace('/404');
    return null;
  }

  if (influencer === undefined) return null;

  setPageTitle(`${influencerId === 'me' ? 'My' : `${influencer.name}'s`} Profile`);

  return <Content influencer={influencer} />;
};
