/* eslint-disable no-console */
import { useCallback, useEffect, useState } from 'react';

import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import { Duration, DateTime } from 'luxon';
import { Form as BsForm, Button } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import {
  ConfirmPhoneNumberMutation,
  ConfirmPhoneNumberWithInvitationMutation,
  ResendOtpMutation,
  ResendOtpWithInvitationMutation,
} from 'src/apollo/queries/phoneNumberMutations';
import { invitationTokenVar } from 'src/apollo/vars/invitationTokenVar';
import { returnUrlVar } from 'src/apollo/vars/returnUrlVar';
import { UserAccount, UserAccountStatus } from 'src/types/UserAccount';

import Layout from '../Layout';
import styles from './styles.module.scss';

const OtpResendDuration = Duration.fromObject({ seconds: 5 });

export default function PhoneNumberConfirmation() {
  const { logout } = useAuth0();
  const history = useHistory();
  const { data: myAccountData } = useQuery<{ myAccount: UserAccount }>(MyAccountQuery, {
    fetchPolicy: 'cache-only',
  });
  const phoneNumber = myAccountData?.myAccount?.phoneNumber;

  const [confirmPhoneNumber, { loading: confirmLoading, error: confirmError }] = useMutation(
    ConfirmPhoneNumberMutation,
  );
  const [
    confirmPhoneNumberWithInvitation,
    { loading: confirmInvitationLoading, error: confirmInvitationError },
  ] = useMutation(ConfirmPhoneNumberWithInvitationMutation);
  const [resendConfirmationCode, { loading: otpIsResending, error: resendError }] = useMutation(ResendOtpMutation);
  const [
    resendConfirmationCodeWithInvitation,
    { loading: invitationOtpIsResending, error: invitationResendError },
  ] = useMutation(ResendOtpWithInvitationMutation);

  const [otpSentAt, setOtpSentAt] = useState(DateTime.local());
  const [canResendOtp, setCanResendOtp] = useState(false);

  const invitationToken = useReactiveVar(invitationTokenVar);

  const handleBack = useCallback(
    (e) => {
      e.preventDefault();
      logout();
    },
    [logout],
  );

  const handleSubmit = useCallback(
    ({ otp }: { otp: string }) => {
      if (!otp) {
        return;
      }

      if (invitationToken) {
        confirmPhoneNumberWithInvitation({
          variables: {
            otp,
            code: invitationToken,
          },
        }).catch((error) => console.error(`error confirming phone number: `, error));
        return;
      }

      if (phoneNumber) {
        confirmPhoneNumber({
          variables: {
            otp,
            phoneNumber,
          },
        }).catch((error) => console.error(`error confirming phone number: `, error));
        return;
      }
    },
    [confirmPhoneNumber, confirmPhoneNumberWithInvitation, phoneNumber, invitationToken],
  );

  const handleResendCode = useCallback(() => {
    const promise = invitationToken
      ? resendConfirmationCodeWithInvitation({ variables: { code: invitationToken } })
      : resendConfirmationCode({ variables: { phoneNumber } });

    promise.then(
      () => {
        setOtpSentAt(DateTime.local());
      },
      (error) => {
        console.error(`error resending confirmation code: `, error);
      },
    );
  }, [phoneNumber, invitationToken, resendConfirmationCode, resendConfirmationCodeWithInvitation]);

  useEffect(() => {
    if (myAccountData?.myAccount?.status !== UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED) {
      const auctionUrl = returnUrlVar();
      window.location.href = auctionUrl || '/';
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

  const isLoading = confirmLoading || confirmInvitationLoading || otpIsResending || invitationOtpIsResending;
  const error = confirmError ?? confirmInvitationError ?? resendError ?? invitationResendError;

  if (!myAccountData) {
    return null;
  }

  return (
    <Layout>
      <section>
        <a className="back-link pt-5 text-label text-all-cups" href="" title="Back" onClick={handleBack}>
          <span className="back-link-arrows">&#171;&#32;&#32;</span>back
        </a>
        <div className="text-headline pt-3">Please, confirm your phone number</div>

        <Form className="pt-3" onSubmit={handleSubmit}>
          {(formProps) => (
            <BsForm onSubmit={formProps.handleSubmit}>
              <div className={clsx('pt-3', styles.message)}>Verification code has been sent to: {phoneNumber}</div>
              {error && <div className="pt-1 error-message text-label">{error.message}</div>}
              <Field name="otp">
                {(props) => (
                  <BsForm.Group className="d-inline-block">
                    <BsForm.Label>Confirmation number</BsForm.Label>
                    <BsForm.Control {...props.input} className={styles.input} disabled={isLoading} />
                  </BsForm.Group>
                )}
              </Field>
              <Button
                className="ml-2 mb-2 d-inline-block text-label"
                disabled={isLoading}
                type="submit"
                variant="secondary"
              >
                Confirm
              </Button>
              {canResendOtp && (
                <Button
                  className="ml-2 d-inline-block text-label"
                  disabled={isLoading}
                  variant="link"
                  onClick={handleResendCode}
                >
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
