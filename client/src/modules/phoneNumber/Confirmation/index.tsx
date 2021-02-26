import { useCallback, useEffect, useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Duration, DateTime } from 'luxon';
import { Form as BsForm, Button } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import { MyAccountQuery } from 'src/apollo/queries/MyAccountQuery';
import { UserAccount, UserAccountStatus } from 'src/types/UserAccount';

import Layout from '../Layout';

import './styles.scss';

const OtpResendDuration = Duration.fromObject({ seconds: 5 });

const ConfirmPhoneNumberMutation = gql`
  mutation EnterPhoneNumber($phoneNumber: String!, $otp: String!) {
    confirmAccountWithPhoneNumber(input: { phoneNumber: $phoneNumber, otp: $otp }) {
      id
      phoneNumber
      status
      influencerProfile {
        id
      }
    }
  }
`;

const ResendOtpMutation = gql`
  mutation ResendOtp($phoneNumber: String!) {
    createAccountWithPhoneNumber(phoneInput: { phoneNumber: $phoneNumber }) {
      id
      phoneNumber
      status
      influencerProfile {
        id
      }
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

  const [confirmPhoneNumber, { loading: formSubmitting, error: confirmError }] = useMutation(
    ConfirmPhoneNumberMutation,
  );
  const [resendConfirmationCode, { loading: otpIsResending, error: resendError }] = useMutation(ResendOtpMutation);

  const [otpSentAt, setOtpSentAt] = useState(DateTime.local());
  const [canResendOtp, setCanResendOtp] = useState(false);

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
        }).catch((error) => console.error(`error confirming phone number: `, error));
      }
    },
    [confirmPhoneNumber, phoneNumber],
  );

  const handleResendCode = useCallback(() => {
    resendConfirmationCode({ variables: { phoneNumber } }).then(
      () => {
        setOtpSentAt(DateTime.local());
      },
      (error) => {
        console.error(`error resending confirmation code: `, error);
      },
    );
  }, [phoneNumber, resendConfirmationCode]);

  useEffect(() => {
    if (myAccountData?.myAccount?.status !== UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED) {
      history.replace('/');
    }
  }, [myAccountData, history]);

  useEffect(() => {
    const refreshCanResendOtp = () => {
      const durationSinceOtpSent = otpSentAt.diffNow().negate();
      const nextCanResendOtp = durationSinceOtpSent > OtpResendDuration;
      if (nextCanResendOtp !== canResendOtp) {
        setCanResendOtp(nextCanResendOtp);
      }
    };

    refreshCanResendOtp();
    const interval = setInterval(refreshCanResendOtp, 1000);

    return () => clearInterval(interval);
  }, [otpSentAt, canResendOtp]);

  const isLoading = formSubmitting || otpIsResending;
  const error = confirmError ?? resendError;

  if (!myAccountData) {
    return null;
  }

  return (
    <Layout>
      <section className="phone-number-confirmation-page">
        <a className="back-link pt-5 text-label text-all-cups" href="/" title="Back" onClick={handleBack}>
          <span className="back-link-arrows">&#171;&#32;&#32;</span>back
        </a>
        <div className="text-headline pt-3">Please, confirm your phone number</div>

        <Form className="pt-3" onSubmit={handleSubmit}>
          {(formProps) => (
            <BsForm className="phone-number-confirmation-form" onSubmit={formProps.handleSubmit}>
              <div className="phone-number-confirmation-message pt-3">
                Verification code has been sent to: {phoneNumber}
              </div>
              {error && <div className="pt-1 error-message text-label">{error.message}</div>}
              <Field name="otp">
                {(props) => (
                  <BsForm.Group className="d-inline-block">
                    <BsForm.Label>Confirmation number</BsForm.Label>
                    <BsForm.Control {...props.input} disabled={isLoading} />
                  </BsForm.Group>
                )}
              </Field>
              <Button className="ml-2 d-inline-block btn-ochre" disabled={isLoading} type="submit">
                Confirm
              </Button>
              {canResendOtp && (
                <Button className="ml-2 d-inline-block" disabled={isLoading} variant="link" onClick={handleResendCode}>
                  Resend code
                </Button>
              )}
            </BsForm>
          )}
        </Form>
      </section>
    </Layout>
  );
}
