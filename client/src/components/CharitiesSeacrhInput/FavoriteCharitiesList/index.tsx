import { useCallback, useEffect, MouseEvent } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import { MyCharitiesQuery } from 'src/apollo/queries/charities';
import { Charity } from 'src/types/Charity';
import { UserAccount } from 'src/types/UserAccount';

import styles from './styles.module.scss';

export default function FavoriteCharitiesList({
  state,
  updateState,
  removeFromFavoriteCharities,
}: {
  state: any;
  updateState: any;
  removeFromFavoriteCharities: (charityId: string | undefined) => void;
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
    <ul className={clsx(`p-0 m-0`, styles.charitiesList)} onClick={onFavoriteCharityClick}>
      {state.favoriteCharities.map((charity: Charity) => (
        <li
          key={'charity-item-' + charity.id}
          className={clsx(`text-label align-middle`, styles.charitiesItem)}
          title={charity.name}
        >
          <span>{charity.name}</span>
          <Button data-charity-id={charity.id} variant="" />
        </li>
      ))}
    </ul>
  );
}
