import React, { FC, useCallback, useState } from 'react';

import clsx from 'clsx';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import useField from 'src/components/Form/hooks/useField';

import './styles.scss';

interface Props {
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  small?: boolean;
  selected?: any;
}

const SelectField: FC<Props> = ({ name, children, options, placeholder, small, selected }) => {
  const [selectedOption, setSelectedOption] = useState(selected);
  const { hasError, errorMessage, onChange, value, ...inputProps } = useField(name, {});

  const handleSelect = useCallback(
    (key) => {
      setSelectedOption(options.find((option) => option.value === key));
      onChange(key);
    },
    [onChange, options],
  );

  return (
    <DropdownButton
      className={clsx('text-subhead w-100 justify-content-start select-field', !selectedOption && 'emptyState')}
      size={small ? 'sm' : undefined}
      {...inputProps}
      as={ButtonGroup}
      id={`dropdown-variants-${value}`}
      title={selectedOption?.label || placeholder}
      variant="outline-primary"
      onSelect={handleSelect}
    >
      {options.map(({ value, label }: { value: string; label: string }) => (
        <Dropdown.Item key={value + label} active={selectedOption?.value === value} eventKey={value}>
          {label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default SelectField;
