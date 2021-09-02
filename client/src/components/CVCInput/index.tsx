import { forwardRef, BaseSyntheticEvent, KeyboardEvent } from 'react';

import { Form as BsForm } from 'react-bootstrap';

import useField from 'src/components/Form/hooks/useField';
import useFieldConstraints from 'src/components/Form/hooks/useFieldConstraints';

import CVCInfo from './CVCInfo';

const { Group, Control } = BsForm;

interface Props {
  disabled: boolean;
  type: string;
  name: string;
  labelText: string;
  maxLength: number;
  placeholder?: string;
  prompt?: boolean;
  onInput?: (event: BaseSyntheticEvent) => void;
  ref?: HTMLInputElement | null;
  isInvalid?: boolean;
  value?: string;
  constraints?: { [key: string]: any };
  required?: boolean;
  externalText?: string;
}

const CVCInput = forwardRef<HTMLInputElement | null, Props>(
  (
    {
      disabled,
      type,
      name,
      labelText,
      maxLength,
      placeholder,
      onInput,
      isInvalid,
      value,
      constraints: inputConstraints,
      required,
    },
    ref,
  ) => {
    const constraints = useFieldConstraints(inputConstraints, required);
    const { hasError, errorMessage, ...inputProps } = useField(name, { constraints, disabled });
    return (
      <label className="text-label w-100">
        <p className="mt-2 mb-2">
          {labelText}
          <span title="The CVV/CVC code (Card Verification Value/Code) is located on the back of your credit/debit card on the right side of the white signature strip; it is always the last 3 digits in case of VISA and MasterCard.">
            <CVCInfo />
          </span>
        </p>
        <Group>
          <Control
            {...inputProps}
            ref={ref}
            disabled={disabled}
            isInvalid={hasError || isInvalid}
            maxLength={maxLength}
            name={name}
            placeholder={placeholder}
            type={type}
            value={value}
            onInput={onInput ? (e: BaseSyntheticEvent) => onInput(e) : () => {}}
            onKeyPress={(event: KeyboardEvent) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
          <Control.Feedback type="invalid">{errorMessage}</Control.Feedback>
        </Group>
      </label>
    );
  },
);
CVCInput.displayName = 'DeliveryCardInput';
export default CVCInput;
