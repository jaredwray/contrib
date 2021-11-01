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

  const handleOnClose = useCallback(() => {
    setNewPhoneNumber('');
    setVerified(false);
    setCloseDialog();
  }, [setCloseDialog]);

  return (
    <Dialog className="p-4" open={showDialog} title="Confirm Number" onClose={handleOnClose}>
      <DialogContent className={styles.content}>
        {verified ? (
          <ConfirmationStep
            newPhoneNumber={newPhoneNumber}
            setNewPhoneNumber={(value) => {
              setNewPhoneNumber(value);
            }}
            setPhoneNumber={(value: string) => {
              setPhoneNumber(value);
            }}
            setVerified={() => {
              setVerified(false);
            }}
            onClose={handleOnClose}
          />
        ) : (
          <VerificationStep
            currentPhoneNumber={currentPhoneNumber}
            newPhoneNumber={newPhoneNumber}
            setNewPhoneNumber={(value) => {
              setNewPhoneNumber(value);
            }}
            setVerified={() => {
              setVerified(true);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
