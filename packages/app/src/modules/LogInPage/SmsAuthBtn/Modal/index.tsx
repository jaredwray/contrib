import { FC, useState, useCallback } from 'react';

import Dialog from 'src/components/modals/Dialog';
import DialogContent from 'src/components/modals/Dialog/DialogContent';

import { PhoneNumberConfirmation } from './phoneNumberConfirmation';
import { PhoneNumberVerification } from './phoneNumberVerification';

interface Props {
  open: boolean;
  isConfirmed: boolean;
  setIsConfirmed: (value: boolean) => void;
  onClose: () => void;
  returnURL: string;
}

export const Modal: FC<Props> = ({ open, onClose, isConfirmed, setIsConfirmed, returnURL }) => {
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const handleOnClose = useCallback(() => {
    setPhoneInputValue('');
    onClose();
  }, [setPhoneInputValue, onClose]);

  return (
    <Dialog open={open} title="Log in with SMS" onClose={handleOnClose}>
      <DialogContent>
        {isConfirmed ? (
          <PhoneNumberConfirmation phoneNumber={phoneInputValue} returnURL={returnURL} />
        ) : (
          <PhoneNumberVerification
            phoneNumber={phoneInputValue}
            setIsConfirmed={setIsConfirmed}
            setPhoneNumber={setPhoneInputValue}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
