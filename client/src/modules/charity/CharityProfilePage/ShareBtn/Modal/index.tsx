import { FC } from 'react';

import Dialog from 'src/components/modals/Dialog';
import DialogContent from 'src/components/modals/Dialog/DialogContent';

interface Props {
  name: string;
  src: string;
  open: boolean;
  onClose: () => void;
}

export const QRCodeModal: FC<Props> = ({ name, src, open, onClose }) => {
  return (
    <Dialog classNameHeader="pb-0" open={open} title={`Share Charity: ${name}`} onClose={onClose}>
      <DialogContent className="p-0">
        <img alt="qr code" className="mx-auto d-block w-100 h-100" src={src} />
      </DialogContent>
    </Dialog>
  );
};
