import { useCallback, useEffect, useState } from 'react';

import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import { Button, Form as BsForm } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';
import PhoneInput from 'react-phone-input-2';
import { useHistory } from 'react-router-dom';

import { MyAccountQuery } from 'src/apollo/queries/myAccountQuery';
import { EnterPhoneNumberMutation, EnterInvitationCodeMutation } from 'src/apollo/queries/phoneNumberVerification';
import { invitationTokenVar } from 'src/apollo/vars/invitationTokenVar';
import { UserAccount, UserAccountStatus } from 'src/types/UserAccount';

import Layout from '../Layout';
import styles from './styles.module.scss';

export default function PhoneNumberVerification() {
  const { logout } = useAuth0();
  const history = useHistory();
  const { data: myAccountsData } = useQuery<{ myAccount: UserAccount }>(MyAccountQuery, {
    fetchPolicy: 'cache-only',
  });
  const [enterPhoneNumber, { loading: formSubmitting }] = useMutation(EnterPhoneNumberMutation);
  const [enterInvitationCode] = useMutation(EnterInvitationCodeMutation);
  const [error, setError] = useState();
  const invitationToken = useReactiveVar(invitationTokenVar);

  const handleSubmit = useCallback(
    ({ phoneNumber }) => {
      phoneNumber &&
        enterPhoneNumber({ variables: { phoneNumber: `+${phoneNumber}` } }).catch((error) => setError(error.message));
    },
    [enterPhoneNumber],
  );

  const handleBack = useCallback(
    (e) => {
      e.preventDefault();
      logout();
    },
    [logout],
  );

  useEffect(() => {
    if (myAccountsData?.myAccount?.status !== UserAccountStatus.PHONE_NUMBER_REQUIRED) {
      history.replace('/');
    }
  }, [myAccountsData, history]);

  useEffect(() => {
    if (invitationToken) {
      enterInvitationCode({ variables: { code: invitationToken } }).catch((error) => {
        console.error('error submitting invitation token', error);
        invitationTokenVar(null);
      });
    }
  }, [invitationToken, enterInvitationCode]);

  if (invitationToken) {
    return null;
  }

  return (
    <Layout>
      <section>
        <a className="back-link pt-5 text-label text-all-cups" href="" title="Back" onClick={handleBack}>
          <span className="back-link-arrows">&#171;&#32;&#32;</span>back
        </a>
        <div className="text-headline pt-3">Please, enter your phone number</div>

        <Form onSubmit={handleSubmit}>
          {(formProps) => (
            <BsForm onSubmit={formProps.handleSubmit}>
              <div className={clsx('pt-1 text-label', styles.errorMessage)}>{error}</div>

              <Field name="phoneNumber">
                {(props) => (
                  <PhoneInput
                    disabled={formSubmitting}
                    {...props.input}
                    containerClass="mb-3 w-auto d-inline-block pr-3"
                    copyNumbersOnly={false}
                    country={'us'}
                    inputProps={{ required: true }}
                    placeholder=""
                    specialLabel=""
                  />
                )}
              </Field>
              <Button
                className="submit-btn mb-2 btn-with-input text-label"
                disabled={formSubmitting}
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
