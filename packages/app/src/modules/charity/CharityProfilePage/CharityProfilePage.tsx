import { FC } from 'react';

import { useQuery } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';

import { GetCharity } from 'src/apollo/queries/charityProfile';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Charity } from 'src/types/Charity';

import { CharityProfilePageContent } from './CharityProfilePageContent';

export const CharityProfilePage: FC = () => {
  const history = useHistory();
  const charityId = useParams<{ charityId: string }>().charityId ?? 'me';
  const { data, error } = useQuery<{ charity: Charity }>(GetCharity, {
    variables: { id: charityId },
  });
  const charity = data?.charity;

  if (charity === null) {
    history.replace('/404');
    return null;
  }
  if (error || charity === undefined) return null;

  setPageTitle(charityId === 'me' ? 'My charity' : `Charity ${charity.name}`);

  return <CharityProfilePageContent charity={charity} />;
};
