import { FC, useState } from 'react';

import { DocumentNode } from '@apollo/client';
import { Button } from 'react-bootstrap';

import { Modal } from './Modal';

interface Props {
  mutation: DocumentNode;
}

export const InviteButton: FC<Props> = ({ mutation }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button className="w-100 text-label" variant="dark" onClick={() => setShowDialog(true)}>
        Invite +
      </Button>
      <Modal mutation={mutation} open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
};
