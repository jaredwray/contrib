import React, { FC, useState } from 'react';

import { DocumentNode } from '@apollo/client';
import { Button } from 'react-bootstrap';

import { Auction } from 'src/types/Auction';

import { Modal } from './Modal';

interface Props {
  auction: Auction;
  mutation: DocumentNode;
  getAuctionsList: () => void;
  className: string;
}

export const DeliveryButton: FC<Props> = ({ auction, className, mutation, getAuctionsList }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button className={className} variant="link" onClick={() => setShowDialog(true)}>
        Set Delivery Properties
      </Button>
      <Modal
        auction={auction}
        getAuctionsList={getAuctionsList}
        mutation={mutation}
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};
