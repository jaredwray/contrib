import { ReactElement, SetStateAction, useCallback, useState, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

import { ProposeInvitationMutation } from 'src/apollo/queries/invitations';
import AsyncButton from 'src/components/buttons/AsyncButton';
import Form from 'src/components/forms/Form/Form';
import InputField from 'src/components/forms/inputs/InputField';
import PhoneInput from 'src/components/forms/inputs/PhoneInput2';
import { useShowNotification } from 'src/helpers/useShowNotification';

import styles from './styles.module.scss';

interface Props {
  setActiveForm: (_: SetStateAction<number>) => void;
}

const InfluencerInvitation = ({ setActiveForm }: Props): ReactElement => {
  const { showMessage, showError } = useShowNotification();
  const [inviteMutation] = useMutation(ProposeInvitationMutation);
  const [creating, setCreating] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);

  const onSubmit = useCallback(
    (values) => {
      setCreating(true);

      inviteMutation({
        variables: { input: { ...values, phoneNumber: `+${values.phoneNumber}`, parentEntityType: 'INFLUENCER' } },
      })
        .then(() => {
          showMessage('You will receive a response upon approval');
        })
        .catch((error) => showError(error.message))
        .finally(() => setActiveForm(0));
    },
    [inviteMutation, showMessage, showError, setCreating, setActiveForm],
  );

  useEffect(() => {
    setCanSubmit(formCompleted && captchaPassed);
  }, [formCompleted, captchaPassed, setCanSubmit]);

  return (
    <Form
      initialValues={{ firstName: null, phoneNumber: null }}
      requiredFields={['firstName', 'phoneNumber']}
      onFill={() => setFormCompleted(true)}
      onSubmit={onSubmit}
      onUnfill={() => setFormCompleted(false)}
    >
      <div className={clsx(styles.title, 'text-label-new text-start')}>
        <div>Auction your memorabilia quickly and hassle-free</div>
        <div className="fw-normal">Use this form to receive an invitation</div>
      </div>
      <InputField required className="mt-4" displayError={false} name="firstName" placeholder="Your full name" />
      <PhoneInput placeholder="Your phone number" />
      <div className={clsx(styles.captcha, 'py-4 text-center pe-auto')}>
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_KEY ?? ''}
          onChange={(value) => setCaptchaPassed(!!value)}
        />
      </div>
      <AsyncButton
        className={clsx(styles.submitBtn, 'text-label w-100')}
        disabled={!canSubmit || creating}
        loading={creating}
        type="submit"
      >
        Request Invitation
      </AsyncButton>
      <Button
        className={clsx(styles.cancelBtn, 'text-label w-100 pb-0')}
        variant="link"
        onClick={() => setActiveForm(0)}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default InfluencerInvitation;
