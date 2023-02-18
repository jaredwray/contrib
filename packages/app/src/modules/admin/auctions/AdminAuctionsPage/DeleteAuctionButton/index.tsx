import React, { FC, useState } from 'react';

import { DocumentNode } from '@apollo/client';
import { Button } from 'react-bootstrap';

import { Modal } from 'src/components/modals/AdminAuctionsPageModal';
import { Auction } from 'src/types/Auction';

interface Props {
  auction: Auction;
  mutation: DocumentNode;
  className: string;
}

export const DeleteAuctionButton: FC<Props> = ({ auction, className, mutation }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button className={className} variant="link" onClick={() => setShowDialog(true)}>
        Delete
      </Button>
      <Modal auction={auction} mutation={mutation} open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
};
