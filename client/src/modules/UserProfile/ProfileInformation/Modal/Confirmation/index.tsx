import { FC, useState, useEffect, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Duration, DateTime } from 'luxon';
import { Button, Form as BsForm } from 'react-bootstrap';
import { Field, Form } from 'react-final-form';

import { VerifyChangePhoneNumberMutation, ConfirmChangePhoneNumberMutation } from 'src/apollo/queries/userProfile';

interface Props {
  newPhoneNumber: string;
  onClose: () => void;
  setPhoneNumber: (arg: string) => void;
}

const DELAY_VALUE_MS = 1000;

const ConfirmationStep: FC<Props> = ({ newPhoneNumber, onClose, setPhoneNumber }) => {
  const OtpResendDuration = Duration.fromObject({ seconds: process.title === 'browser' ? 5 : 0 });

  const [error, setError] = useState('');
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState(DateTime.local());

  const [verifyPhoneNumber, { loading: verifyLoading }] = useMutation(VerifyChangePhoneNumberMutation);
  const [confirmPhoneNumber, { loading: confirmLoading }] = useMutation(ConfirmChangePhoneNumberMutation, {
    /* istanbul ignore next */
    onCompleted: () => {
      setPhoneNumber(newPhoneNumber);
      onClose();
    },
  });

  useEffect(() => {
    const refreshCanResendOtp = () => {
      const durationSinceOtpSent = otpSentAt.diffNow().negate();
      const nextCanResendOtp = durationSinceOtpSent > OtpResendDuration;

      if (nextCanResendOtp !== canResendOtp) {
        setCanResendOtp(nextCanResendOtp);
      }
    };

    refreshCanResendOtp();

    const interval = setInterval(refreshCanResendOtp, DELAY_VALUE_MS);

    return () => clearInterval(interval);
  }, [otpSentAt, canResendOtp, OtpResendDuration]);

  const handleSubmitConfirmation = useCallback(
    ({ otp }: { otp: string }) => {
      if (!otp) {
        return;
      }
      if (newPhoneNumber) {
        confirmPhoneNumber({
          variables: {
            otp,
            phoneNumber: `+${newPhoneNumber}`,
          },
        }).catch((error) => setError(error.message));
      }
    },
    [confirmPhoneNumber, newPhoneNumber],
  );

  const handleResendCode = useCallback(() => {
    setError('');
    verifyPhoneNumber({ variables: { phoneNumber: `+${newPhoneNumber}` } })
      .then(() => {
        setOtpSentAt(DateTime.local());
      })
      .catch((error) => setError(error.message));
  }, [verifyPhoneNumber, setOtpSentAt, newPhoneNumber]);

  const loading = verifyLoading || confirmLoading;

  return (
    <Form className="pt-3" onSubmit={handleSubmitConfirmation}>
      {(formProps) => (
        <BsForm onSubmit={formProps.handleSubmit}>
          <p className="mb-1">Verification code has been sent to: {`+${newPhoneNumber}`}</p>
          <p className="mb-1 error-message text-label">{error || (verifyLoading && 'Resending...')}&nbsp;</p>
          <Field name="otp">
            {(props) => (
              <BsForm.Group className="d-block">
                <BsForm.Label>Confirmation number</BsForm.Label>
                <BsForm.Control {...props.input} disabled={loading} />
              </BsForm.Group>
            )}
          </Field>
          <div className="d-flex justify-content-between flex-wrap ">
            <Button
              className="d-inline-block text-label pl-0 mr-2"
              disabled={loading || !canResendOtp}
              variant="link"
              onClick={handleResendCode}
            >
              Resend code
            </Button>
            <Button className="d-inline-block text-label" disabled={loading} type="submit" variant="secondary">
              Confirm
            </Button>
          </div>
        </BsForm>
      )}
    </Form>
  );
};

export default ConfirmationStep;
