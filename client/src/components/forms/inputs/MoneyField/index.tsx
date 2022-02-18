import React, { FC, useCallback, ReactElement, SetStateAction } from 'react';

import Dinero from 'dinero.js';
import { Form as BsForm } from 'react-bootstrap';

import useField from 'src/components/forms/Form/hooks/useField';
import useFieldConstraints from 'src/components/forms/Form/hooks/useFieldConstraints';

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
  valueFromState?: { amount: number; currency: Dinero.Currency };
  setDisabled?: (_: SetStateAction<boolean>) => void;
  setValueToState?: (name: string, value: Dinero.DineroObject) => void;
}

const MaxLength = 8;
const MaxBidValue = 999999;

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
  valueFromState,
  setDisabled,
  setValueToState,
}) => {
  const constraints = useFieldConstraints(inputConstraints, required);
  const { hasError, errorMessage, value, onChange, ...inputProps } = useField(name, { constraints, disabled });

  let filteredValueFromState;

  if (valueFromState) {
    filteredValueFromState = Dinero({
      amount: parseInt(valueFromState.amount.toString().slice(-1 * MaxLength)),
      currency: valueFromState.currency,
    });
  }

  let filteredValue;

  if (value) {
    filteredValue = Dinero({
      amount: parseInt(value.amount.toString().slice(-1 * MaxLength)),
      currency: value.currency,
    });
  }

  const handleChange = useCallback(
    (event) => {
      const targetValue = event.target.value;
      const number = targetValue.replace(/[^0-9]/g, '');

      if (setDisabled && minValue) setDisabled(minValue > number || number > MaxBidValue);

      const currentValue = valueFromState || value;
      const onChangeValue = { ...currentValue, amount: number ? parseInt(number, 10) * 100 : 0 };

      onChange(onChangeValue);

      if (setValueToState) setValueToState(name, onChangeValue);
    },
    [value, name, minValue, valueFromState, setDisabled, setValueToState, onChange],
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
        value={filteredValueFromState?.toFormat('$0,0') || filteredValue?.toFormat('$0,0')}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      <Control.Feedback type="invalid">{errorMessage}</Control.Feedback>
      {externalText && <p className="text--body mt-2">{externalText}</p>}
    </Group>
  );
};

export default MoneyField;
