import React, { FC } from 'react';

import useField from 'src/components/Form/hooks/useField';
import Select from 'src/components/Select';

interface Props {
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  small?: boolean;
  selected?: any;
}

const SelectField: FC<Props> = ({ name, options, placeholder, small, selected }) => {
  const { hasError, errorMessage, value, ...inputProps } = useField(name, {});

  return <Select options={options} selected={selected} small={small} {...inputProps} placeholder={placeholder} />;
};

export default SelectField;
