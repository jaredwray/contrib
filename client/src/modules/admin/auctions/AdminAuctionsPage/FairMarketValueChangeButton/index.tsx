import React, { FC, useState } from 'react';

import { DocumentNode } from '@apollo/client';
import { Button } from 'react-bootstrap';

import { Auction } from 'src/types/Auction';

import { Modal } from './Modal';

interface Props {
  auction: Auction;
  mutation: DocumentNode;
  className: string;
  getAuctionsList: () => void;
}

export const FairMarketValueChangeButton: FC<Props> = ({ auction, className, mutation, getAuctionsList }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button className={className} variant="link" onClick={() => setShowDialog(true)}>
        Set Fair Market Value
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
