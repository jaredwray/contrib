import React, { FC, useCallback } from 'react';

import { addDays, differenceInCalendarDays } from 'date-fns';
import { Form as BsForm } from 'react-bootstrap';
import { useFormState } from 'react-final-form';

import useField from 'src/components/Form/hooks/useField';
import useFieldConstraints from 'src/components/Form/hooks/useFieldConstraints';

const { Group, Label, Control } = BsForm;

interface Props {
  name: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  constraints?: { [key: string]: any };
  externalText?: string;
}

const SelectField: FC<Props> = ({
  name,
  title,
  placeholder,
  required,
  disabled,
  className,
  constraints: inputConstraints,
  externalText,
  children,
}) => {
  const { values } = useFormState();
  const constraints = useFieldConstraints(inputConstraints, required);
  const { hasError, errorMessage, onChange, ...inputProps } = useField(name, { constraints, disabled });

  const duration = differenceInCalendarDays(new Date(values.endDate), new Date(values.startDate));

  const handleChange = useCallback(
    (event) => {
      const count = parseInt(event.target.value, 10);
      const newDate = addDays(new Date(values.startDate), count).toISOString();
      onChange(newDate);
    },
    [onChange, values.startDate],
  );

  return (
    <Group>
      {title && <Label>{title}</Label>}
      <Control
        as="select"
        {...inputProps}
        className={className}
        isInvalid={hasError}
        placeholder={placeholder}
        value={duration}
        onChange={handleChange}
      >
        {children}
      </Control>
      {externalText && <p className="text-body mt-2">{externalText}</p>}
    </Group>
  );
};

export default SelectField;
