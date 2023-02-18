import { FC, useState } from 'react';

import AuthBtn from '../AuthBtn';
import { Modal } from './Modal';

const DELAY_VALUE_MS = 200;

interface Props {
  returnURL: string;
}

export const SmsAuthBtn: FC<Props> = ({ returnURL }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleClose = () => {
    setShowDialog(false);
    setTimeout(() => setIsConfirmed(false), DELAY_VALUE_MS); //without delay, when closing the modal window at the verification stage, the transition to the confirmation stage will be visible
  };

  return (
    <>
      <AuthBtn provider="sms" smsOnClick={() => setShowDialog(true)} text="SMS code" />
      <Modal
        isConfirmed={isConfirmed}
        open={showDialog}
        returnURL={returnURL}
        setIsConfirmed={setIsConfirmed}
        onClose={handleClose}
      />
    </>
  );
};
