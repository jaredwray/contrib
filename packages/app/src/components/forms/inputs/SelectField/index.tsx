import React, { FC } from 'react';

import clsx from 'clsx';

import useField from 'src/components/forms/Form/hooks/useField';
import Select from 'src/components/forms/selects/Select';

interface Props {
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  small?: boolean;
  selected?: any;
  className?: string;
  isDisabled?: boolean;
}

const SelectField: FC<Props> = ({ name, options, placeholder, small, selected, className, isDisabled }) => {
  const { hasError, errorMessage, value, disabled, ...inputProps } = useField(name, {});

  return (
    <Select
      className={clsx(className, 'd-block')}
      disabled={isDisabled}
      options={options}
      selected={selected}
      small={small}
      {...inputProps}
      placeholder={placeholder}
    />
  );
};

export default SelectField;
