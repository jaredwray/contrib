import React, { FC, useState } from 'react';

import { DocumentNode } from '@apollo/client';
import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Auction } from 'src/types/Auction';

import { Modal } from './Modal';

interface Props {
  auction: Auction;
  mutation: DocumentNode;
  className: string;
}

export const FairMarketValueChangeButton: FC<Props> = ({ auction, className, mutation }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button className={className} variant="link" onClick={() => setShowDialog(true)}>
        Set Fair Market Value
      </Button>
      {auction.isPending && (
        <Link className={clsx(className, 'btn')} to={`/auctions/${auction.id}/basic`}>
          Edit
        </Link>
      )}
      <Modal auction={auction} mutation={mutation} open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
};
