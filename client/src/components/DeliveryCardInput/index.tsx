import { forwardRef, BaseSyntheticEvent, KeyboardEvent } from 'react';

import InputField from '../Form/InputField';
import CVCInfo from './CVCInfo';

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
}

const DeliveryCardInput = forwardRef<HTMLInputElement | null, Props>(
  ({ disabled, type, name, labelText, maxLength, placeholder, prompt, onInput }, ref) => {
    return (
      <label className="text-label w-100">
        <p className="mt-2 mb-2">
          {labelText}
          {prompt && (
            <span title="The CVV/CVC code (Card Verification Value/Code) is located on the back of your credit/debit card on the right side of the white signature strip; it is always the last 3 digits in case of VISA and MasterCard.">
              <CVCInfo />
            </span>
          )}
        </p>
        <InputField
          ref={ref}
          required
          disabled={disabled}
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
