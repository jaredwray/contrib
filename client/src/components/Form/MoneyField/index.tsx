import React, { FC, useCallback } from 'react';

import Dinero from 'dinero.js';
import { Form as BsForm } from 'react-bootstrap';

import useField from '../hooks/useField';
import useFieldConstraints from '../hooks/useFieldConstraints';

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

const MoneyField: FC<Props> = ({
  name,
  title,
  placeholder,
  required,
  disabled,
  className,
  constraints: inputConstraints,
  externalText,
}) => {
  const constraints = useFieldConstraints(inputConstraints, required);
  const { hasError, errorMessage, value, onChange, ...inputProps } = useField(name, { constraints, disabled });

  const handleChange = useCallback(
    (event) => {
      const targetValue = event.target.value;
      const number = targetValue.replace(/\$|,|\./g, '');
      onChange({ ...value, amount: parseInt(number, 10) });
    },
    [onChange, value],
  );

  return (
    <Group>
      {title && <Label>{title}</Label>}
      <Control
        {...inputProps}
        className={className}
        isInvalid={hasError}
        placeholder={placeholder}
        value={Dinero(value).toFormat('$0,0.00')}
        onChange={handleChange}
      />
      <Control.Feedback type="invalid">{errorMessage}</Control.Feedback>
      {externalText && <p className="text-body mt-2">{externalText}</p>}
    </Group>
  );
};

export default MoneyField;
