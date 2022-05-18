import { FC, useCallback, useState } from 'react';

import clsx from 'clsx';
import { Field } from 'react-final-form';
import PhoneInput from 'react-phone-input-2';

import { ALLOWED_COUNTRY_NAME, Country } from 'src/types/Country';

import styles from './styles.module.scss';

interface Props {
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const USPhoneInput: FC<Props> = ({ className, placeholder, disabled = false }: Props) => {
  const [inputValue, setInputValue] = useState('');

  const onClick = useCallback(
    (event: any, data: any) => {
      !inputValue && setInputValue('+1');
    },
    [inputValue, setInputValue],
  );
  return (
    <Field name="phoneNumber">
      {({ input }) => {
        const { value, onChange, ...inputProps } = input;
        return (
          <PhoneInput
            containerClass={clsx(styles.input, className)}
            copyNumbersOnly={false}
            disabled={disabled}
            inputProps={{
              required: true,
              name: 'phoneNumber',
              country: 'us',
            }}
            isValid={(value: string, country: any): any => {
              if (value && country.name !== ALLOWED_COUNTRY_NAME)
                return (
                  <p className={clsx(styles.error, 'text-label error-message position-absolute')}>
                    Must be a valid US phone number
                  </p>
                );
              return true;
            }}
            placeholder={placeholder}
            specialLabel=""
            value={inputValue}
            onChange={(value: string, country: Country) => setInputValue(value)}
            onClick={onClick}
            {...inputProps}
          />
        );
      }}
    </Field>
  );
};

export default USPhoneInput;
