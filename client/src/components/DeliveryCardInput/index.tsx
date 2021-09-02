import { forwardRef, BaseSyntheticEvent, KeyboardEvent } from 'react';

import InputField from '../Form/InputField';

interface Props {
  disabled: boolean;
  type: string;
  name: string;
  labelText: string;
  maxLength: number;
  placeholder?: string;
  onInput?: (event: BaseSyntheticEvent) => void;
  ref?: HTMLInputElement | null;
  isInvalid?: boolean;
}

const DeliveryCardInput = forwardRef<HTMLInputElement | null, Props>(
  ({ disabled, type, name, labelText, maxLength, placeholder, onInput, isInvalid }, ref) => {
    return (
      <label className="text-label w-100">
        <p className="mt-2 mb-2">{labelText}</p>
        <InputField
          ref={ref}
          required
          disabled={disabled}
          isInvalid={isInvalid}
          maxLength={maxLength}
          name={name}
          placeholder={placeholder}
          type={type}
          wrapperClassName="mb-1"
          onInput={onInput}
          onKeyPress={(event: KeyboardEvent) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </label>
    );
  },
);
DeliveryCardInput.displayName = 'DeliveryCardInput';
export default DeliveryCardInput;
