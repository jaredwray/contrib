import React, { FC, useState } from 'react';

import { DocumentNode } from '@apollo/client';
import { Button } from 'react-bootstrap';

import { Auction } from 'src/types/Auction';

import { Modal } from './Modal';

interface Props {
  auction: Auction;
  mutation: DocumentNode;
  className: string;
}

export const StopOrActiveButton: FC<Props> = ({ auction, className, mutation }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button className={className} variant="link" onClick={() => setShowDialog(true)}>
        {auction.isStopped ? 'Activate' : 'Stop'}
      </Button>
      <Modal auction={auction} mutation={mutation} open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
};
