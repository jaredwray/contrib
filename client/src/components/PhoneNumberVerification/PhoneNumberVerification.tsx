import { useCallback, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import { Form as BsForm } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Field, Form } from 'react-final-form';

import SimpleLayout from '../SimpleLayout/SimpleLayout';

import { UserAccount, UserAccountStatus } from '../../model/UserAccount';
import { MyAccountQuery } from '../../apollo/queries/MyAccountQuery';

import './PhoneNumberVerification.scss';
import 'react-phone-input-2/lib/style.css';

const EnterPhoneNumberMutation = gql`
  mutation EnterPhoneNumber($phoneNumber: String!) {
    createAccountWithPhoneNumber(phoneInput: { phoneNumber: $phoneNumber }) {
      id
      phoneNumber
      status
    }
  }
`;

export default function PhoneNumberVerification() {
  const { logout } = useAuth0();
  const history = useHistory();
  const { data: myAccountData, loading: myAccountsLoading } = useQuery<{ myAccount: UserAccount }>(MyAccountQuery, {
    fetchPolicy: 'cache-only',
  });
  const [enterPhoneNumber, { loading: formSubmitting }] = useMutation(EnterPhoneNumberMutation);

  const handleSubmit = useCallback(
    (variables) => {
      enterPhoneNumber({ variables }).catch((error) => console.error('error submitting phone number', error));
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
    if (!myAccountsLoading && myAccountData?.myAccount?.status !== UserAccountStatus.PHONE_NUMBER_REQUIRED) {
      history.replace('/');
    }
  }, [myAccountData?.myAccount?.status, history, myAccountsLoading]);

  return (
    <SimpleLayout>
      <a href="/" onClick={handleBack} className="back-link pt-5 text-label text-all-cups" title="Back">
        <span className="back-link-arrows">&#171;&#32;&#32;</span>back
      </a>
      <div className="text-headline pt-3">Please, enter your phone number</div>

      <Form onSubmit={handleSubmit}>
        {(formProps) => (
          <BsForm className="pt-3" onSubmit={formProps.handleSubmit}>
            <Field name="phoneNumber">
              {(props) => (
                <BsForm.Group>
                  <PhoneInput disabled={formSubmitting} {...props.input} country={'us'} copyNumbersOnly={false} />
                </BsForm.Group>
              )}
            </Field>

            <button disabled={formSubmitting} type="submit" className="btn submit-btn">
              Confirm
            </button>
          </BsForm>
        )}
      </Form>
    </SimpleLayout>
  );
}
