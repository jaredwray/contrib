import React, { FC, useCallback, useState, useEffect } from 'react';

import clsx from 'clsx';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import './styles.scss';

interface Props {
  options: any[];
  placeholder?: string;
  selected?: any;
  onChange(value: string): void;
  small?: boolean;
  className?: string;
  disabled?: boolean;
}

const Select: FC<Props> = ({ options, placeholder, selected, onChange, small, className, disabled }) => {
  const [selectedOption, setSelectedOption] = useState(selected);
  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);
  const isArrayOfObjects = options?.length ? typeof options[0] === 'object' : null;
  const handleSelect = useCallback(
    (key) => {
      setSelectedOption(options.find((option) => (isArrayOfObjects ? option.value === key : option === key)));
      onChange(key);
    },
    [isArrayOfObjects, onChange, options],
  );
  const title = isArrayOfObjects ? selectedOption?.label : selectedOption;

  if (!options) return null;

  return (
    <DropdownButton
      as={ButtonGroup}
      className={clsx('text-subhead justify-content-start select-field', !selectedOption && 'emptyState', className)}
      disabled={disabled}
      id="dropdown-select"
      size={small ? 'sm' : undefined}
      title={title || placeholder}
      variant="outline-primary"
      onSelect={handleSelect}
    >
      {options && options.length && isArrayOfObjects ? (
        <div className="dropdown-items-wrapper">
          {options.map(({ value, label }: { value: string; label: string }) => (
            <Dropdown.Item
              key={value + label}
              active={selectedOption?.value === value}
              as="div"
              className="text-truncate"
              eventKey={value}
              title={label}
            >
              {label}
            </Dropdown.Item>
          ))}
        </div>
      ) : (
        <div className="dropdown-items-wrapper">
          {options.map((option: string) => (
            <Dropdown.Item
              key={option}
              active={selectedOption === option}
              as="div"
              className="text-truncate"
              eventKey={option}
              title={option}
            >
              {option}
            </Dropdown.Item>
          ))}
        </div>
      )}
    </DropdownButton>
  );
};

export default Select;
