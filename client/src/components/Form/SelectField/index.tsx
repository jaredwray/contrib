import React, { FC, useCallback } from 'react';

import clsx from 'clsx';
import { addDays, differenceInCalendarDays, parseISO, toDate } from 'date-fns';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { useFormState } from 'react-final-form';

import useField from 'src/components/Form/hooks/useField';
import { serializeStartDate } from 'src/modules/auctions/DetailsPage/utils';

import './styles.scss';

interface Props {
  name: string;
  options: { eventKey: string; label: string }[];
  placeholder?: string;
  small?: boolean;
}

const SelectField: FC<Props> = ({ name, children, options, placeholder, small }) => {
  const { values } = useFormState();
  const { hasError, errorMessage, onChange, value, ...inputProps } = useField(name, {});

  const startDate = serializeStartDate(values.startDate);
  const duration = differenceInCalendarDays(toDate(parseISO(value)), toDate(parseISO(startDate)));

  const handleSelect = useCallback(
    (key) => {
      const count = parseInt(key, 10);
      const newDate = addDays(toDate(parseISO(startDate)), count);
      onChange(newDate.toISOString());
    },
    [onChange, startDate],
  );

  const activeOption = options.find(({ eventKey }) => parseInt(eventKey, 10) === duration);

  return (
    <DropdownButton
      className={clsx('text-subhead w-100 justify-content-start', !activeOption && 'emptyState')}
      size={small ? 'sm' : undefined}
      {...inputProps}
      as={ButtonGroup}
      id={`dropdown-variants-${value}`}
      title={activeOption?.label || placeholder}
      variant="outline-primary"
      onSelect={handleSelect}
    >
      {options.map(({ eventKey, label }: { eventKey: string; label: string }) => (
        <Dropdown.Item key={eventKey} active={duration === parseInt(eventKey, 10)} eventKey={eventKey}>
          {label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default SelectField;
