import React, { FC, useCallback } from 'react';

import { addDays, differenceInCalendarDays, parseISO, toDate } from 'date-fns';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { useFormState } from 'react-final-form';

import useField from 'src/components/Form/hooks/useField';
import { serializeStartDate } from 'src/modules/auctions/DetailsPage/utils';

interface Props {
  name: string;
}

const SelectField: FC<Props> = ({ name, children }) => {
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

  return (
    <DropdownButton
      className="text-subhead w-100 justify-content-start"
      {...inputProps}
      as={ButtonGroup}
      id={`dropdown-variants-${value}`}
      title={duration}
      variant="outline-primary"
      onSelect={handleSelect}
    >
      {children}
    </DropdownButton>
  );
};

export default SelectField;
