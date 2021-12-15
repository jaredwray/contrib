import { useState, FC } from 'react';

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

  return (
    <Dialog
      open={open}
      title="Log in with SMS"
      onClose={() => {
        setPhoneInputValue('');
        onClose();
      }}
    >
      <DialogContent className="pt-4 pb-4">
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
