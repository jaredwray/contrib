import React, { FC, useCallback, ReactElement, SetStateAction } from 'react';

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
  externalText?: string | ReactElement;
  minValue?: number;
  setDisabled?: (_: SetStateAction<boolean>) => void;
}

const MaxLength = 11;

const MoneyField: FC<Props> = ({
  name,
  title,
  placeholder,
  required,
  disabled,
  className,
  constraints: inputConstraints,
  externalText,
  minValue,
  setDisabled,
}) => {
  const constraints = useFieldConstraints(inputConstraints, required);
  const { hasError, errorMessage, value, onChange, ...inputProps } = useField(name, { constraints, disabled });

  const filteredValue = Dinero({
    amount: parseInt(value.amount.toString().slice(-1 * MaxLength)),
    currency: value.currency,
  });

  const handleChange = useCallback(
    (event) => {
      const targetValue = event.target.value;
      const number = targetValue.replace(/[^0-9]/g, '');
      if (setDisabled && minValue) {
        setDisabled(minValue > number);
      }
      onChange({ ...value, amount: number ? parseInt(number, 10) * 100 : 0 });
    },
    [onChange, value, minValue, setDisabled],
  );

  const handleFocus = useCallback((event) => event.target.select(), []);

  return (
    <Group>
      {title && <Label>{title}</Label>}
      <Control
        {...inputProps}
        className={className}
        isInvalid={hasError}
        maxLength={MaxLength}
        placeholder={placeholder}
        value={filteredValue.toFormat('$0,0')}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      <Control.Feedback type="invalid">{errorMessage}</Control.Feedback>
      {externalText && <p className="text--body mt-2">{externalText}</p>}
    </Group>
  );
};

export default MoneyField;
