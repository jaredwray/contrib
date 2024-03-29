import { FC } from 'react';

import clsx from 'clsx';
import PhoneInput from 'react-phone-input-2';

import { Country, ALLOWED_COUNTRY_NAME } from 'src/types/Country';

import styles from './styles.module.scss';

interface Props {
  disabled?: boolean;
  className?: string;
  value: string;
  onChange: (value: string, country: Country) => void;
  valueIsValid?: boolean;
  validateFunction?: (value: string) => string | undefined;
  errorText?: string;
  otherProps?: any;
}

const USPhoneInput: FC<Props> = ({
  disabled,
  className,
  value,
  onChange,
  valueIsValid,
  errorText,
  validateFunction,
  ...otherProps
}: Props) => {
  const isValid = valueIsValid ?? true;

  return (
    <PhoneInput
      containerClass={className}
      copyNumbersOnly={false}
      country="us"
      disabled={disabled}
      inputClass={isValid ? '' : 'is-invalid'}
      inputProps={{ required: true, name: 'phoneNumber', country: 'us' }}
      isValid={(value: string, country: any): any => {
        let validationText;

        if (validateFunction) validationText = validateFunction(value);
        if (country.name !== ALLOWED_COUNTRY_NAME) validationText = 'Must be a valid US phone number';

        return (
          <p className={clsx(styles.error, 'text-label error-message position-absolute')}>
            {validationText || errorText}
          </p>
        );
      }}
      placeholder=""
      specialLabel=""
      value={value}
      onChange={onChange}
      {...otherProps}
    />
  );
};

export default USPhoneInput;
