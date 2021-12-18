import { FC, useState, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Button, Form as BsForm } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';

import { VerifyChangePhoneNumberMutation } from 'src/apollo/queries/userProfile';
import PhoneInput from 'src/components/forms/inputs/PhoneInput';
import { Country, ALLOWED_COUNTRY_NAME } from 'src/types/Country';

import styles from './styles.module.scss';

interface Props {
  currentPhoneNumber: string | undefined;
  newPhoneNumber: string;
  setNewPhoneNumber: (arg: string) => void;
  setVerified: () => void;
}

const VerificationStep: FC<Props> = ({ currentPhoneNumber, newPhoneNumber, setNewPhoneNumber, setVerified }) => {
  const countryName = ALLOWED_COUNTRY_NAME;
  const [newPhoneNumberIsValid, setNewPhoneNumberIsValid] = useState(false);
  const [error, setError] = useState('');

  const [verifyPhoneNumber, { loading: verifyLoading }] = useMutation(VerifyChangePhoneNumberMutation, {
    /* istanbul ignore next */
    onCompleted: () => setVerified(),
  });

  const handleSubmitVerification = useCallback(() => {
    newPhoneNumber &&
      verifyPhoneNumber({ variables: { phoneNumber: `+${newPhoneNumber}` } }).catch((error) => setError(error.message));
  }, [verifyPhoneNumber, newPhoneNumber]);

  const handleChange = useCallback(
    (value: string, country: Country) => {
      setNewPhoneNumber(value);
      setNewPhoneNumberIsValid(country.name === countryName && value !== currentPhoneNumber);
    },
    [countryName, currentPhoneNumber, setNewPhoneNumber, setNewPhoneNumberIsValid],
  );

  return (
    <Form onSubmit={handleSubmitVerification}>
      {(formProps) => (
        <BsForm onSubmit={formProps.handleSubmit}>
          <div className="d-flex justify-content-end justify-content-sm-between flex-wrap">
            <Field name="phoneNumber">
              {({ input }) => (
                <PhoneInput
                  className={clsx(styles.input, 'd-inline-block mb-4 mb-sm-0 mr-sm-4')}
                  errorText={error}
                  otherProps={{ ...input }}
                  validateFunction={(value) => {
                    if (value === currentPhoneNumber) {
                      return 'You provided your current phone number';
                    }
                  }}
                  value={newPhoneNumber}
                  valueIsValid={newPhoneNumberIsValid}
                  onChange={handleChange}
                />
              )}
            </Field>

            <Button
              className={clsx(styles.btn, 'submit-btn text-label ')}
              disabled={verifyLoading || !newPhoneNumberIsValid}
              type="submit"
              variant="secondary"
            >
              Confirm
            </Button>
          </div>
        </BsForm>
      )}
    </Form>
  );
};

export default VerificationStep;
