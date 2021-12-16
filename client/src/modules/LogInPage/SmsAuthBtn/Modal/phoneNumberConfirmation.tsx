import { useCallback, useEffect, useState, FC, BaseSyntheticEvent } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Duration, DateTime } from 'luxon';
import { Form as BsForm, Button } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';

import { SendOtpMutation } from 'src/apollo/queries/phoneNumberMutations';
import { mergeUrlPath } from 'src/helpers/mergeUrlPath';
import { useShowNotification } from 'src/helpers/useShowNotification';

import styles from './styles.module.scss';

const OtpResendDuration = Duration.fromObject({ seconds: 5 });

const DELAY_VALUE_MS = 1000;

interface Props {
  phoneNumber: string;
  returnURL: string;
}

export const PhoneNumberConfirmation: FC<Props> = ({ phoneNumber, returnURL }) => {
  const [otpSentAt, setOtpSentAt] = useState(DateTime.local());
  const [otpValue, setOtpValue] = useState('');
  const [otpIsValid, setOtpIsValid] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [loadingLogIn, setLoadingLogIn] = useState(false);

  const { showError } = useShowNotification();

  const [sendOtp, { loading: loadingOtp }] = useMutation(SendOtpMutation);

  let afterLoginUri = mergeUrlPath(process.env.REACT_APP_PLATFORM_URL, '/after-login');

  if (returnURL) afterLoginUri += `?returnURL=${returnURL}`;

  const handleChange = (e: BaseSyntheticEvent) => {
    const otp = e.target.value;

    setOtpValue(otp);

    if (otp.length === 6 && !otpIsValid) {
      return setOtpIsValid(true);
    }

    if (otpIsValid) {
      setOtpIsValid(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      const apiUrl = mergeUrlPath(process.env.REACT_APP_API_AUDIENCE, '/api/v1/auth/sms');
      setLoadingLogIn(true);
      const responce = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: `+${phoneNumber}`, otp: otpValue }),
      });

      const result = await responce.json();

      if (result?.error) {
        return showError(result.error.message);
      }

      window.location.href = afterLoginUri;
    } catch (err) {
      showError(err.message);
    } finally {
      setLoadingLogIn(false);
    }
  }, [phoneNumber, afterLoginUri, showError, otpValue]);

  const handleResendCode = useCallback(() => {
    sendOtp({ variables: { phoneNumber: `+${phoneNumber}` } })
      .then(() => {
        setOtpSentAt(DateTime.local());
      })
      .catch((error) => {
        showError(error.message);
      });
  }, [phoneNumber, sendOtp, showError]);

  useEffect(() => {
    const refreshCanResendOtp = () => {
      const durationSinceOtpSent = otpSentAt.diffNow().negate();
      const nextCanResendOtp = durationSinceOtpSent > OtpResendDuration;
      if (process.title !== 'browser' || nextCanResendOtp !== canResendOtp) {
        setCanResendOtp(nextCanResendOtp);
      }
    };

    refreshCanResendOtp();
    const interval = setInterval(refreshCanResendOtp, DELAY_VALUE_MS);

    return () => clearInterval(interval);
  }, [otpSentAt, canResendOtp]);

  const isLoading = loadingLogIn || loadingOtp;

  return (
    <>
      <div className="text-subhead pt-3 pb-3">Please, confirm your phone number</div>
      <Form className="pt-3" onSubmit={handleSubmit}>
        {(formProps) => (
          <BsForm onSubmit={formProps.handleSubmit}>
            <div className={clsx('pt-3', styles.message)}>Verification code has been sent to: {`+${phoneNumber}`}</div>
            <Field name="otp">
              {(props) => (
                <BsForm.Group className="">
                  <BsForm.Label>Confirmation number</BsForm.Label>
                  <BsForm.Control
                    {...props.input}
                    className={styles.input}
                    disabled={isLoading}
                    maxLength={6}
                    value={otpValue}
                    onChange={handleChange}
                  />
                </BsForm.Group>
              )}
            </Field>
            <Button
              className="submit-btn mb-2 text-label d-inline-block"
              disabled={isLoading || !otpIsValid}
              type="submit"
              variant="secondary"
            >
              Confirm
            </Button>
            {(process.title === 'browser' ? canResendOtp : true) && (
              <Button
                className="ml-2 d-inline-block text-label"
                data-test-id="resend_otp"
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
    </>
  );
};
