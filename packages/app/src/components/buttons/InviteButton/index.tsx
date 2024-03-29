import React, { FC, useState } from 'react';

import { DocumentNode } from '@apollo/client';
import { Button } from 'react-bootstrap';

import { Modal } from './Modal';

interface Props {
  mutation: DocumentNode;
  updateEntitisList: () => void;
  mutationVariables?: Record<string, string>;
  text?: string;
  variant?: string;
  className?: string;
}

export const InviteButton: FC<Props> = ({
  className,
  mutation,
  mutationVariables,
  text,
  variant,
  updateEntitisList,
}) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        className={className ?? 'w-100 text-label'}
        variant={variant ?? 'dark'}
        onClick={() => setShowDialog(true)}
      >
        {text ?? 'Invite +'}
      </Button>
      <Modal
        mutation={mutation}
        mutationVariables={mutationVariables}
        open={showDialog}
        updateEntitisList={updateEntitisList}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};
