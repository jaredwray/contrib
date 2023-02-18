import { useCallback, useEffect, useState, FC } from 'react';

import { useMutation } from '@apollo/client';
import { Button, Form as BsForm } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';

import { SendOtpMutation } from 'src/apollo/queries/phoneNumberMutations';
import PhoneInput from 'src/components/forms/inputs/PhoneInput';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { ALLOWED_COUNTRY_NAME } from 'src/types/Country';

interface Props {
  phoneNumber: string;
  setIsConfirmed: (value: boolean) => void;
  setPhoneNumber: (value: string) => void;
}

export const PhoneNumberVerification: FC<Props> = ({ phoneNumber, setIsConfirmed, setPhoneNumber }) => {
  const [phoneInputIsValid, setPhoneInputIsValid] = useState(false);

  const { showMessage, showError } = useShowNotification();

  const [sendOtp, { loading }] = useMutation(SendOtpMutation);

  const allowedCountryName = ALLOWED_COUNTRY_NAME;

  useEffect(() => {
    if (!phoneNumber) setPhoneNumber('1');
    if (phoneNumber[0] === '1') return;

    const passedValue = phoneNumber.toString().split('');
    passedValue.unshift('1');
    setPhoneNumber(passedValue.join(''));
  }, [phoneNumber, setPhoneInputIsValid, setPhoneNumber]);

  const handleSubmit = useCallback(() => {
    sendOtp({ variables: { phoneNumber: `+${phoneNumber}` } })
      .then(() => {
        setIsConfirmed(true);
        showMessage('Verification code has been sent');
      })
      .catch((error) => {
        showError(error.message);
      });
  }, [phoneNumber, sendOtp, setIsConfirmed, showError, showMessage]);

  const handleChange = (value: string, country: Country) => {
    setPhoneNumber(value);
    setPhoneInputIsValid(country.name === allowedCountryName && value.length === 11);
  };

  interface Country {
    countryCode: string;
    dialCode: string;
    format: string;
    name: string;
  }

  return (
    <>
      <div className="text-subhead pb-3">Please, enter your phone number</div>
      <Form onSubmit={handleSubmit}>
        {(formProps) => (
          <BsForm
            className="d-flex justify-content-md-between align-items-md-center flex-md-row flex-column"
            onSubmit={formProps.handleSubmit}
          >
            <Field name="phoneNumber">
              {({ input }) => (
                <PhoneInput
                  className="w-auto d-inline-block"
                  disabled={loading}
                  otherProps={{ input }}
                  value={phoneNumber}
                  onChange={handleChange}
                />
              )}
            </Field>
            <Button
              className="submit-btn text-label d-inline-block"
              disabled={loading || !phoneInputIsValid}
              type="submit"
              variant="secondary"
            >
              Confirm
            </Button>
          </BsForm>
        )}
      </Form>
    </>
  );
};
