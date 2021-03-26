import React, { FC } from 'react';

import useField from 'src/components/Form/hooks/useField';
import Select from 'src/components/Select';

interface Props {
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  small?: boolean;
  selected?: any;
  className?: string;
}

const SelectField: FC<Props> = ({ name, options, placeholder, small, selected, className }) => {
  const { hasError, errorMessage, value, ...inputProps } = useField(name, {});

  return (
    <Select
      className={className}
      options={options}
      selected={selected}
      small={small}
      {...inputProps}
      placeholder={placeholder}
    />
  );
};

export default SelectField;
