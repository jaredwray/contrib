import { useCallback, useEffect, useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Form as BsForm } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';
import PhoneInput from 'react-phone-input-2';
import { useHistory } from 'react-router-dom';

import { MyAccountQuery } from 'src/apollo/queries/MyAccountQuery';
import { UserAccount, UserAccountStatus } from 'src/types/UserAccount';

import Layout from '../Layout';

import './styles.scss';

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
      phoneNumber &&
        enterPhoneNumber({
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
    <Layout>
      <section className="phone-number-verification-page">
        <a className="back-link pt-5 text-label text-all-cups" href="/" title="Back" onClick={handleBack}>
          <span className="back-link-arrows">&#171;&#32;&#32;</span>back
        </a>
        <div className="text-headline pt-3">Please, enter your phone number</div>

        <Form onSubmit={handleSubmit}>
          {(formProps) => (
            <BsForm onSubmit={formProps.handleSubmit}>
              <div className="pt-1 error-message text-label">{error}</div>

              <Field name="phoneNumber">
                {(props) => (
                  <PhoneInput
                    disabled={formSubmitting}
                    {...props.input}
                    containerClass="mb-3"
                    copyNumbersOnly={false}
                    country={'us'}
                    inputProps={{ required: true }}
                    placeholder=""
                    specialLabel=""
                  />
                )}
              </Field>
              <Button className="submit-btn btn-ochre mb-2" disabled={formSubmitting} type="submit">
                Confirm
              </Button>
            </BsForm>
          )}
        </Form>
      </section>
    </Layout>
  );
}
