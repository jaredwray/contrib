import { FC } from 'react';

import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { GetTotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { GetCharity } from 'src/apollo/queries/charityProfile';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Charity } from 'src/types/Charity';

import { CharityProfilePageContent } from './CharityProfilePageContent';

export const CharityProfilePage: FC = () => {
  const charityId = useParams<{ charityId: string }>().charityId ?? 'me';
  const { data } = useQuery<{ charity: Charity }>(GetCharity, {
    variables: { id: charityId },
  });
  const responce = useQuery(GetTotalRaisedAmountQuery, {
    variables: { charityId },
  });

  const charity = data?.charity;
  if (!charity) {
    return null;
  }

  const totalRaisedAmount = responce.data?.getTotalRaisedAmount.totalRaisedAmount;

  setPageTitle(charityId === 'me' ? 'My charity' : `Charity ${charity.name}`);

  return <CharityProfilePageContent charity={charity} totalRaisedAmount={totalRaisedAmount} />;
};
