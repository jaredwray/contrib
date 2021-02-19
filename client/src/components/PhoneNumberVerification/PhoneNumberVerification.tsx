import { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import { Button, Form as BsForm } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Field, Form } from 'react-final-form';

import SimpleLayout from '../SimpleLayout/SimpleLayout';
import { UserAccount, UserAccountStatus } from '../../model/UserAccount';
import { MyAccountQuery } from '../../apollo/queries/MyAccountQuery';

import './PhoneNumberVerification.scss';

const EnterPhoneNumberMutation = gql`
  mutation EnterPhoneNumber($phoneNumber: String!) {
    createAccountWithPhoneNumber(input: { phoneNumber: $phoneNumber }) {
      id
      phoneNumber
      status
    }
  }
`;

export default function PhoneNumberVerification() {
  const { logout } = useAuth0();
  const history = useHistory();
  const { data: myAccountsData } = useQuery<{ myAccount: UserAccount }>(MyAccountQuery, {
    fetchPolicy: 'cache-only',
  });
  const [enterPhoneNumber, { loading: formSubmitting }] = useMutation(EnterPhoneNumberMutation);
  const [error, setError] = useState();

  const handleSubmit = useCallback(
    ({ phoneNumber }) => {
      phoneNumber && enterPhoneNumber({
        variables: {
          phoneNumber: `+${phoneNumber}`,
        },
      }).catch((error) => setError(error.message));
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

  return (
    <SimpleLayout>
      <section className="phone-number-verification-page">
        <a href="/" onClick={handleBack} className="back-link pt-5 text-label text-all-cups" title="Back">
          <span className="back-link-arrows">&#171;&#32;&#32;</span>back
        </a>
        <div className="text-headline pt-3">Please, enter your phone number</div>

        <Form onSubmit={handleSubmit}>
          {(formProps) => (
            <BsForm onSubmit={formProps.handleSubmit}>
              <div className='pt-1 error-message text-label'>{error}</div>

              <Field name="phoneNumber">
                {(props) => (
                  <PhoneInput
                    disabled={formSubmitting}
                    {...props.input}
                    country={'us'}
                    copyNumbersOnly={false}
                    specialLabel=""
                    placeholder=""
                    inputProps={{ required: true }}
                    containerClass="mb-3"
                  />
                )}
              </Field>
              <Button disabled={formSubmitting} type="submit" className="submit-btn btn-ochre mb-2">
                Confirm
              </Button>
            </BsForm>
          )}
        </Form>
      </section>
    </SimpleLayout>
  );
}
