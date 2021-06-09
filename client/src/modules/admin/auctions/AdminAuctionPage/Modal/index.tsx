import { FC } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import AsyncButton from 'src/components/AsyncButton';
import Dialog from 'src/components/Dialog';
import DialogActions from 'src/components/Dialog/DialogActions';
import DialogContent from 'src/components/Dialog/DialogContent';
import Form from 'src/components/Form/Form';
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
    <Dialog open={open} title={`Charge ${isBid ? 'bid' : 'auction'}`} onClose={onClose}>
      <DialogContent>
        <Form className="font-weight-normal text-center" onSubmit={onConfirm}>
          <div>
            Withdraw <b>${bid?.amount / 100}</b>
          </div>
          <div>
            from user with #id <b>{user}</b>?
          </div>
          <DialogActions className="justify-content-center flex-column-reverse flex-sm-row pt-4">
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
              className={clsx(styles.actionBtn, 'ml-0 mr-sm-auto p-3')}
              disabled={loading}
              loading={loading}
              type="submit"
              variant="secondary"
            >
              Submit {isBid ? 'bid' : 'charge'}
            </AsyncButton>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
