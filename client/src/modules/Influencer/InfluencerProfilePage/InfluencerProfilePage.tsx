import { FC, useContext } from 'react';

import { useQuery } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';

import { GetTotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { GetInfluencerQuery } from 'src/apollo/queries/influencers';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { InfluencerProfile, InfluencerStatus } from 'src/types/InfluencerProfile';

import { InfluencerProfilePageContent } from './InfluencerProfilePageContent';

export const InfluencerProfilePage: FC = () => {
  const { account } = useContext(UserAccountContext);
  const history = useHistory();
  const influencerId = useParams<{ influencerId?: string }>().influencerId ?? 'me';
  const isMyProfile = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(influencerId);

  const { data } = useQuery<{ influencer: InfluencerProfile }>(GetInfluencerQuery, {
    variables: { id: influencerId },
  });

  const responce = useQuery(GetTotalRaisedAmountQuery, {
    variables: { influencerId },
  });

  const influencer = data?.influencer;
  if (!influencer) {
    return null;
  }
  if (influencer.status === InfluencerStatus.TRANSIENT && !account?.isAdmin && !isMyProfile) {
    history.push('/');
  }
  const totalRaisedAmount = responce.data?.getTotalRaisedAmount.totalRaisedAmount;

  setPageTitle(`${influencerId === 'me' ? 'My' : `${influencer.name}'s`} Profile`);

  return <InfluencerProfilePageContent influencer={influencer} totalRaisedAmount={totalRaisedAmount} />;
};
