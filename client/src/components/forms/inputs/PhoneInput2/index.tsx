import { FC } from 'react';

import clsx from 'clsx';
import { Field } from 'react-final-form';
import PhoneInput from 'react-phone-input-2';

import { ALLOWED_COUNTRY_NAME } from 'src/types/Country';

import styles from './styles.module.scss';

interface Props {
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const USPhoneInput: FC<Props> = ({ className, placeholder, disabled = false }: Props) => {
  return (
    <Field name="phoneNumber">
      {({ input }) => (
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
          {...input}
        />
      )}
    </Field>
  );
};

export default USPhoneInput;
