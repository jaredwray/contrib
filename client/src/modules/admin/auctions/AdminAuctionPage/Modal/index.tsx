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
  customerLoading: boolean;
  customerInformation: { email: string; phone: string } | null;
  bid: AuctionBid | null;
  isBid?: boolean;
  loading: boolean;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const Modal: FC<Props> = ({
  customerLoading,
  onConfirm,
  onClose,
  open,
  isBid,
  loading,
  bid: currentBid,
  customerInformation,
}) => {
  if (!currentBid || (!customerInformation && customerLoading)) {
    return null;
  }
  const { bid, user } = currentBid;
  return (
    <Dialog
      className="font-weight-normal text-left"
      open={open}
      title={`Charge ${isBid ? 'bid' : 'auction'}`}
      onClose={onClose}
    >
      <DialogContent className="text-center pt-0">
        <p>
          Withdraw <b>${bid?.amount / 100}</b>
          <br />
          from user with #id {user.mongodbId}?
        </p>
        {!customerInformation && !customerLoading ? (
          <>Cannot receive customer data from stripe</>
        ) : (
          <>
            Email: <b>{customerInformation?.email}</b>
            <br />
            Phone: <b>{customerInformation?.phone}</b>
          </>
        )}
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
