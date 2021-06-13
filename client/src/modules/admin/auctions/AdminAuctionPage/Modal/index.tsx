import { FC } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import AsyncButton from 'src/components/AsyncButton';
import Dialog from 'src/components/Dialog';
import DialogActions from 'src/components/Dialog/DialogActions';
import DialogContent from 'src/components/Dialog/DialogContent';
import { AuctionBid } from 'src/types/Auction';

import styles from './chargeModal.module.scss';

interface Props {
  bid: AuctionBid | null;
  isBid?: boolean;
  loading: boolean;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const Modal: FC<Props> = ({ onConfirm, onClose, open, isBid, loading, bid: currentBid }) => {
  if (!currentBid) {
    return null;
  }
  const { bid, user } = currentBid;
  return (
    <Dialog
      className={clsx(styles.modal, 'font-weight-normal text-center')}
      open={open}
      title={`Charge ${isBid ? 'bid' : 'auction'}`}
      onClose={onClose}
    >
      <DialogContent>
        <p>
          Withdraw <b>${bid?.amount / 100}</b>
        </p>
        <p>
          from user with #id <b>{user}</b>?
        </p>
      </DialogContent>
      <DialogActions className="justify-content-center flex-column-reverse flex-sm-row pt-0 pt-sm-2">
        <Button
          className={clsx(styles.actionBtn, 'ml-0 mr-sm-auto p-3')}
          disabled={loading}
          size="sm"
          variant="light"
          onClick={onClose}
        >
          Cancel
        </Button>
        <AsyncButton
          className={clsx(styles.actionBtn)}
          disabled={loading}
          loading={loading}
          variant="secondary"
          onClick={onConfirm}
        >
          Submit {isBid ? 'bid' : 'charge'}
        </AsyncButton>
      </DialogActions>
    </Dialog>
  );
};
