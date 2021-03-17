import React, { FC, useCallback, useState } from 'react';

import clsx from 'clsx';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import './styles.scss';

interface Props {
  options: any[];
  placeholder?: string;
  selected?: any;
  onChange(value: string): void;
  small?: boolean;
}

const Select: FC<Props> = ({ options, placeholder, selected, onChange, small }) => {
  const [selectedOption, setSelectedOption] = useState(selected);

  const isArrayOfObjects = options?.length ? typeof options[0] === 'object' : null;

  const handleSelect = useCallback(
    (key) => {
      setSelectedOption(options.find((option) => (isArrayOfObjects ? option.value === key : option === key)));
      onChange(key);
    },
    [isArrayOfObjects, onChange, options],
  );

  const title = isArrayOfObjects ? selectedOption?.label : selectedOption;

  if (!options) {
    return null;
  }

  return (
    <DropdownButton
      as={ButtonGroup}
      className={clsx('text-subhead w-100 justify-content-start select-field', !selectedOption && 'emptyState')}
      id={`dropdown-select`}
      size={small ? 'sm' : undefined}
      title={title || placeholder}
      variant="outline-primary"
      onSelect={handleSelect}
    >
      {options && options.length && isArrayOfObjects
        ? options.map(({ value, label }: { value: string; label: string }) => (
            <Dropdown.Item key={value + label} active={selectedOption?.value === value} as="div" eventKey={value}>
              {label}
            </Dropdown.Item>
          ))
        : options.map((option: string) => (
            <Dropdown.Item key={option} active={selectedOption === option} as="div" eventKey={option}>
              {option}
            </Dropdown.Item>
          ))}
    </DropdownButton>
  );
};

export default Select;
