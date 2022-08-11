import React, { FC, useCallback, useState, useEffect, useRef } from 'react';

import clsx from 'clsx';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import InputField from 'src/components/forms/inputs/InputField';

import './styles.scss';

interface Props {
  options: any[];
  placeholder?: string;
  name?: string;
  required?: boolean;
  selected?: any;
  onChange(value: string): void;
  small?: boolean;
  className?: string;
  disabled?: boolean;
  titlePrefix?: string;
}

const Select: FC<Props> = ({
  options,
  placeholder,
  name,
  required,
  selected,
  onChange,
  small,
  className,
  disabled = false,
  titlePrefix = '',
}) => {
  const input = useRef(null);
  const [selectedOption, setSelectedOption] = useState(selected);
  const isArrayOfObjects = options?.length ? typeof options[0] === 'object' : null;
  const title = isArrayOfObjects ? selectedOption?.label : selectedOption;

  const handleSelect = useCallback(
    (key) => {
      setSelectedOption(options.find((option) => (isArrayOfObjects ? option.value === key : option === key)));

      if (input && input.current) {
        const event = new Event('input', { bubbles: true });
        // @ts-ignore: Object is possibly 'null'.
        input.current.dispatchEvent(event);
      }

      onChange(key);
    },
    [isArrayOfObjects, onChange, options],
  );

  useEffect(() => setSelectedOption(selected), [selected]);

  if (!options) return null;

  return (
    <>
      <DropdownButton
        as={ButtonGroup}
        className={clsx('select-field', !selectedOption && 'emptyState', className)}
        disabled={disabled}
        id="dropdown-select"
        size={small ? 'sm' : undefined}
        title={`${titlePrefix}${title || placeholder}`}
        variant=""
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
      {name && <InputField hidden name={name} required={false} valueFromState={selectedOption?.value} />}
    </>
  );
};

export default Select;
