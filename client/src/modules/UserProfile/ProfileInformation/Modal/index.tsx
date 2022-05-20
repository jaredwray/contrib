import { FC, useState, useCallback } from 'react';

import Dialog from 'src/components/modals/Dialog';
import DialogContent from 'src/components/modals/Dialog/DialogContent';

import ConfirmationStep from './Confirmation';
import styles from './styles.module.scss';
import VerificationStep from './Verification';

interface Props {
  currentPhoneNumber: string | undefined;
  showDialog: boolean;
  setCloseDialog: () => void;
  setPhoneNumber: (value: string) => void;
}

const Modal: FC<Props> = ({ currentPhoneNumber, showDialog, setCloseDialog, setPhoneNumber }) => {
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [verified, setVerified] = useState(false);

  const onClose = useCallback(() => {
    setNewPhoneNumber('');
    setVerified(false);
    setCloseDialog();
  }, [setCloseDialog]);

  return (
    <Dialog className={styles.modal} classNameHeader="p-4" open={showDialog} title="Confirm Number" onClose={onClose}>
      <DialogContent className={styles.content}>
        {verified ? (
          <ConfirmationStep
            newPhoneNumber={newPhoneNumber}
            setPhoneNumber={(value: string) => setPhoneNumber(value)}
            onClose={onClose}
          />
        ) : (
          <VerificationStep
            currentPhoneNumber={currentPhoneNumber}
            newPhoneNumber={newPhoneNumber}
            setNewPhoneNumber={(value) => setNewPhoneNumber(value)}
            setVerified={() => setVerified(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
