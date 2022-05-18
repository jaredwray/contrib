import { useCallback, useEffect, useState } from 'react';

import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import clsx from 'clsx';
import { Button, Form as BsForm } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';

import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { EnterPhoneNumberMutation, EnterInvitationCodeMutation } from 'src/apollo/queries/phoneNumberVerification';
import { invitationTokenVar } from 'src/apollo/vars/invitationTokenVar';
import PhoneInput from 'src/components/forms/inputs/PhoneInput';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useAuth } from 'src/helpers/useAuth';
import { ALLOWED_COUNTRY_NAME, Country } from 'src/types/Country';
import { UserAccount, UserAccountStatus } from 'src/types/UserAccount';

import Layout from '../Layout';
import styles from './styles.module.scss';

export default function PhoneNumberVerification() {
  const { logout } = useAuth();
  const { data: myAccountsData } = useQuery<{ myAccount: UserAccount }>(MyAccountQuery, {
    fetchPolicy: 'cache-only',
  });
  const [enterPhoneNumber, { loading: formSubmitting }] = useMutation(EnterPhoneNumberMutation);
  const [enterInvitationCode] = useMutation(EnterInvitationCodeMutation);
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [phoneInputisValid, setPhoneInputIsValid] = useState(false);
  const [error, setError] = useState();
  const invitationToken = useReactiveVar(invitationTokenVar);
  const countryName = ALLOWED_COUNTRY_NAME;

  useEffect(() => {
    if (!phoneInputValue) setPhoneInputValue('1');
    if (phoneInputValue[0] !== '1') {
      const passedValue = phoneInputValue.toString().split('');
      passedValue.unshift('1');
      setPhoneInputValue(passedValue.join(''));
    }
  }, [phoneInputValue]);

  const handleSubmit = useCallback(() => {
    phoneInputValue &&
      enterPhoneNumber({ variables: { phoneNumber: `+${phoneInputValue}` } }).catch((error) => setError(error.message));
  }, [enterPhoneNumber, phoneInputValue]);
  const handleBack = useCallback(
    (e) => {
      e.preventDefault();
      logout!();
    },
    [logout],
  );
  const handleChange = (value: string, country: Country) => {
    setPhoneInputValue(value);
    setPhoneInputIsValid(country.name !== countryName);
  };

  useEffect(() => {
    if (myAccountsData?.myAccount?.status !== UserAccountStatus.PHONE_NUMBER_REQUIRED) {
      window.location.href = '/';
    }
  }, [myAccountsData]);

  useEffect(() => {
    if (invitationToken) {
      enterInvitationCode({ variables: { code: invitationToken } }).catch(() => {
        invitationTokenVar(null);
      });
    }
  }, [invitationToken, enterInvitationCode]);

  if (invitationToken) return null;

  setPageTitle('Phone number verification');
  return (
    <Layout>
      <section>
        <a
          className="back-link pt-5 text-label text-all-cups"
          data-test-id="back_btn"
          href=""
          title="Back"
          onClick={handleBack}
        >
          <span className="back-link-arrows">&#171;&#32;&#32;</span>back
        </a>
        <div className="text-headline pt-3">Please, enter your phone number</div>

        <Form onSubmit={handleSubmit}>
          {(formProps) => (
            <BsForm onSubmit={formProps.handleSubmit}>
              <div className={clsx('pt-1 mb-1 text-label error-message', styles.errorMessage)}>{error}</div>

              <Field name="phoneNumber">
                {({ input }) => (
                  <PhoneInput
                    className="mb-3 w-auto d-inline-block pe-3"
                    disabled={formSubmitting}
                    otherProps={{ input }}
                    value={phoneInputValue}
                    onChange={handleChange}
                  />
                )}
              </Field>
              <Button
                className="submit-btn mb-2 text-label d-inline-block"
                disabled={formSubmitting || phoneInputisValid}
                type="submit"
                variant="secondary"
              >
                Confirm
              </Button>
            </BsForm>
          )}
        </Form>
      </section>
    </Layout>
  );
}
