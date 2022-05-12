import { ReactElement, SetStateAction, useCallback, useState, useEffect } from 'react';

// import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

// import { InviteInfluencerMutation } from 'src/apollo/queries/influencers';
import AsyncButton from 'src/components/buttons/AsyncButton';
import Form from 'src/components/forms/Form/Form';
import InputField from 'src/components/forms/inputs/InputField';
import PhoneInput from 'src/components/forms/inputs/PhoneInput2';
import { useShowNotification } from 'src/helpers/useShowNotification';

import styles from './styles.module.scss';

interface Props {
  setShowForm: (_: SetStateAction<boolean>) => void;
}

const InfluencerInvitation = ({ setShowForm }: Props): ReactElement => {
  const { showMessage } = useShowNotification();
  // const [inviteMutation] = useMutation(InviteInfluencerMutation);
  // const [creating, setCreating] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);

  const onSubmit = useCallback(
    (values) => {
      // setCreating(true);
      // inviteMutation({
      //   variables: { name, phoneNumber: `+${phoneInputValue}` },
      // })
      //   .then(() => {
      //     updateEntitisList();
      //     onClose();
      //     addToast('Invited', { autoDismiss: true, appearance: 'success' });
      //   })
      //   .catch((error) => setInvitationError(error.message))
      //   .finally(() => setCreating(false));
      showMessage('You will receive a response upon approval');
      setShowForm(false);
    },
    [showMessage, setShowForm],
  );

  useEffect(() => {
    setCanSubmit(formCompleted && captchaPassed);
  }, [formCompleted, captchaPassed, setCanSubmit]);

  return (
    <Form
      initialValues={{ fullname: null, phoneNumber: null }}
      requiredFields={['firstName', 'phoneNumber']}
      onFill={() => setFormCompleted(true)}
      onSubmit={onSubmit}
      onUnfill={() => setFormCompleted(false)}
    >
      <div className="text-label-new  text-start">Auction your memorabilia quickly and hassle-free</div>
      <div className="text-label-new fw-normal text-start">Use this form to receive an invitation</div>
      <InputField required className="mt-4" displayError={false} name="firstName" placeholder="Your full name" />
      <PhoneInput placeholder="Your phone number" />
      <div className={clsx(styles.captcha, 'py-4 text-center pe-auto')}>
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_KEY ?? ''}
          onChange={(value) => setCaptchaPassed(!!value)}
        />
      </div>
      <AsyncButton className="text-label w-100" disabled={!canSubmit} type="submit">
        Request Invitation
      </AsyncButton>
      <Button
        className={clsx(styles.cancelBtn, 'text-label w-100 pb-0')}
        variant="link"
        onClick={() => setShowForm(false)}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default InfluencerInvitation;
