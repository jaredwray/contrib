import { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Form as BsForm } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';

import SimpleLayout from '../SimpleLayout/SimpleLayout';

import './PhoneNumberConfirmation.scss';
import { MyAccountQuery } from '../../apollo/queries/MyAccountQuery';
import { UserAccount, UserAccountStatus } from '../../model/UserAccount';
import { useHistory } from 'react-router-dom';

const ConfirmPhoneNumberMutation = gql`
  mutation EnterPhoneNumber($phoneNumber: String!, $otp: String!) {
    confirmAccountWithPhoneNumber(phoneConfirmationInput: { phoneNumber: $phoneNumber, otp: $otp }) {
      id
      phoneNumber
      status
    }
  }
`;

export default function PhoneNumberConfirmation() {
  const { logout } = useAuth0();
  const history = useHistory();
  const { data: myAccountData } = useQuery<{ myAccount: UserAccount }>(MyAccountQuery, {
    fetchPolicy: 'cache-only',
  });
  const phoneNumber = myAccountData?.myAccount?.phoneNumber;
  const [error, setError] = useState();

  const [confirmPhoneNumber, { loading: formSubmitting }] = useMutation(ConfirmPhoneNumberMutation);

  const handleBack = useCallback(
    (e) => {
      e.preventDefault();
      logout();
    },
    [logout],
  );

  const handleSubmit = useCallback(
    ({ otp }: { otp: string }) => {
      if (otp && phoneNumber) {
        confirmPhoneNumber({
          variables: { otp, phoneNumber },
        }).catch((error) => setError(error.message));
      }
    },
    [confirmPhoneNumber, phoneNumber],
  );

  useEffect(() => {
    if (myAccountData?.myAccount?.status !== UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED) {
      console.log(`data = `, myAccountData);
      history.replace('/');
    }
  }, [myAccountData, history]);

  if (!myAccountData) {
    return null;
  }

  return (
    <SimpleLayout>
      <section className="phone-number-confirmation-page">
        <a href="/" onClick={handleBack} className="back-link pt-5 text-label text-all-cups" title="Back">
          <span className="back-link-arrows">&#171;&#32;&#32;</span>back
        </a>
        <div className="text-headline pt-3">Please, confirm your phone number</div>

        <Form onSubmit={handleSubmit} className="pt-3">
          {(formProps) => (
            <BsForm onSubmit={formProps.handleSubmit} className="phone-number-confirmation-form">
              <div className="phone-number-confirmation-message pt-3">
                Verification code has been sent to: {phoneNumber}
              </div>
              <div className='pt-1 error-message text-label'>{error}</div>
              <Field name="otp">
                {(props) => (
                  <BsForm.Group className="d-inline-block">
                    <BsForm.Label>Confirmation number</BsForm.Label>
                    <BsForm.Control {...props.input} disabled={formSubmitting}/>
                  </BsForm.Group>
                )}
              </Field>
              <button type="submit" disabled={formSubmitting} className="ml-2 d-inline-block btn submit-btn">
                Confirm
              </button>
            </BsForm>
          )}
        </Form>
      </section>
    </SimpleLayout>
  );
}
