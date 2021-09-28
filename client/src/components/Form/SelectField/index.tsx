import React, { FC } from 'react';

import useField from 'src/components/Form/hooks/useField';
import Select from 'src/components/selects/Select';

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
      className={className}
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
