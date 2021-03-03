import { useCallback, useEffect, MouseEvent } from 'react';

import { useQuery } from '@apollo/client';
import { Button } from 'react-bootstrap';

import { MyCharitiesQuery } from 'src/apollo/queries/charities';
import { Charity } from 'src/types/Charity';
import { UserAccount } from 'src/types/UserAccount';

import './styles.scss';

export default function FavoriteCharitiesList({
  state,
  updateState,
  removeFromFavoriteCharities,
}: {
  state: any;
  updateState: any;
  removeFromFavoriteCharities: any;
}) {
  const { data: myAccountsData, error: favoriteCharitiesLoadingError } = useQuery<{
    favoriteCharities: Charity[];
    myAccount: UserAccount;
  }>(MyCharitiesQuery);

  const onFavoriteCharityClick = useCallback(
    (e: MouseEvent<HTMLUListElement>) => {
      e.preventDefault();
      const target = e.target as HTMLElement;

      removeFromFavoriteCharities(target.dataset.charityId);
    },
    [state.favoriteCharities],
  );

  useEffect(() => {
    const influencerProfile = myAccountsData?.myAccount?.influencerProfile;
    influencerProfile && updateState('favoriteCharities', influencerProfile.favoriteCharities);
  }, [myAccountsData]);

  if (favoriteCharitiesLoadingError) {
    console.error('Data loading error: ', favoriteCharitiesLoadingError);
  }

  return (
    <ul className="charities-page-charities-list p-0 m-0" onClick={onFavoriteCharityClick}>
      {state.favoriteCharities.map((charity: Charity) => (
        <li
          key={'charity-item-' + charity.id}
          className="charities-page-charity-item text-label align-middle"
          title={charity.name}
        >
          <span>{charity.name}</span>
          <Button data-charity-id={charity.id} />
        </li>
      ))}
    </ul>
  );
}
