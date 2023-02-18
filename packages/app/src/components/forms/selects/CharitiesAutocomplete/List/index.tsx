import { FC } from 'react';

import clsx from 'clsx';

import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

interface PropTypes {
  charities: Charity[];
  onChange: (charity: Charity, isFavorite: boolean) => void;
}

const CharitiesList: FC<PropTypes> = ({ charities, onChange }) => {
  return (
    <ul className={clsx(`p-0 m-0`, styles.charitiesList)}>
      {charities.map((charity) => (
        <li key={charity.id} className={clsx(`text-label align-middle`, styles.charitiesItem)} title={charity.name}>
          <span className={styles.charityName}>{charity.name}</span>
          <button className={styles.button} onClick={() => onChange(charity, false)} />
        </li>
      ))}
    </ul>
  );
};

export default CharitiesList;
