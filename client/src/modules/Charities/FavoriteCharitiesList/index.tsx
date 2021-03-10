import { FC } from 'react';

import clsx from 'clsx';

import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

interface PropTypes {
  charities: Charity[];
  onCharityFavoriteChange: (charity: Charity, isFavorite: boolean) => void;
}

export const FavoriteCharitiesList: FC<PropTypes> = ({ charities, onCharityFavoriteChange }) => {
  return (
    <ul className={clsx(`p-0 m-0`, styles.charitiesList)}>
      {charities.map((charity) => (
        <li key={charity?.id} className={clsx(`text-label align-middle`, styles.charitiesItem)} title={charity?.name}>
          <span className={styles.charityName}>{charity?.name}</span>
          <button className={styles.button} onClick={() => onCharityFavoriteChange(charity, false)} />
        </li>
      ))}
    </ul>
  );
};
