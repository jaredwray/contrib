import { FC, useState } from 'react';

import Select from 'react-select';

import { customStyles, selectStyles } from './customStyles';
import styles from './styles.module.scss';

interface Props {
  options: { value: string; label: string; id: string }[];
  selectedOption: { value: string; label: string; id: string } | null;
  onChange: (value: { value: string; label: string; id: string } | null) => void;
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
