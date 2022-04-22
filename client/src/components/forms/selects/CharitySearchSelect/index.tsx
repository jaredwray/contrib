import { FC, useState, useCallback } from 'react';

import clsx from 'clsx';
import Select from 'react-select';

import InputField from 'src/components/forms/inputs/InputField';

import { customStyles, Colors } from './customStyles';
import styles from './styles.module.scss';

export interface Option {
  value: string;
  label: string;
  id: string;
}

interface Props {
  options: Option[];
  name?: string;
  required?: boolean;
  disabled?: boolean;
  selectedOption: Option | null;
  placeholder?: string;
  floatingLabel?: string;
  onChange: (value: Option | null) => void;
}

export const CharitySearchSelect: FC<Props> = ({
  options,
  name,
  required,
  disabled,
  selectedOption,
  placeholder,
  onChange,
  floatingLabel,
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  const onInputChange = useCallback(
    (value: any, actionMeta: any) => {
      setSearching(menuIsOpen || !!value);
    },
    [menuIsOpen, setSearching],
  );
  const onMenuOpen = useCallback(() => {
    setSearching(true);
    setMenuIsOpen(true);
  }, [setMenuIsOpen, setSearching]);
  const onMenuClose = useCallback(() => {
    setSearching(!!selectedOption);
    setMenuIsOpen(false);
  }, [selectedOption, setMenuIsOpen, setSearching]);

  return (
    <div className="position-relative">
      <Select
        className={styles.charitiesSelect}
        isDisabled={disabled}
        noOptionsMessage={() => 'no charities found'}
        options={options}
        placeholder={placeholder ?? 'Search charity by name'}
        styles={customStyles(!!floatingLabel)}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary50: Colors.primary,
            primary: Colors.primary,
          },
        })}
        value={selectedOption}
        onChange={onChange}
        onInputChange={onInputChange}
        onMenuClose={onMenuClose}
        onMenuOpen={onMenuOpen}
      />
      {floatingLabel && (
        <label className={clsx(styles.label, (selectedOption || searching) && styles.labelActive)}>
          {floatingLabel}
        </label>
      )}
      {name && <InputField hidden name={name} required={false} valueFromState={selectedOption?.value} />}
    </div>
  );
};
