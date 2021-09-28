import { FC, useState } from 'react';

import Select from 'react-select';

import { customStyles, selectStyles } from './customStyles';
import styles from './styles.module.scss';

interface Option {
  value: string;
  label: string;
  id: string;
}

interface Props {
  options: Option[];
  selectedOption: Option | null;
  onChange: (value: Option | null) => void;
}

export const CharitySearchSelect: FC<Props> = ({ options, selectedOption, onChange }) => {
  const [menuIsOpen, setmenuIsOpen] = useState(false);
  return (
    <Select
      className={styles.charitiesSelect}
      noOptionsMessage={() => 'no charities found'}
      options={options}
      placeholder="Search charity by name"
      styles={customStyles(() => setmenuIsOpen, menuIsOpen)}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary50: selectStyles.color,
          primary: selectStyles.color,
        },
      })}
      value={selectedOption}
      onChange={onChange}
    />
  );
};
