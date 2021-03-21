import React, { FC } from 'react';

import { Charity } from 'src/types/Charity';

import Input from './Input';
import List from './List';

interface Props {
  charities: Charity[];

  onChange(charity: Charity, isFavorite: boolean): void;

  disabled?: boolean;
}

const CharitiesAutocomplete: FC<Props> = ({ charities, onChange, disabled }) => {
  return (
    <>
      <Input charities={charities} disabled={disabled} onChange={onChange} />
      <List charities={charities} onChange={onChange} />
    </>
  );
};

export default CharitiesAutocomplete;
