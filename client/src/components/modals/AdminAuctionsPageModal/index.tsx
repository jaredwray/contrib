import { FC, useCallback } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import AsyncButton from 'src/components/buttons/AsyncButton';
import Dialog from 'src/components/modals/Dialog';
import DialogActions from 'src/components/modals/Dialog/DialogActions';
import DialogContent from 'src/components/modals/Dialog/DialogContent';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  mutation: DocumentNode;
  auction: Auction;
  onConfirm?: (auction: Auction) => void;
}

export const Modal: FC<Props> = ({ open, onClose, onConfirm, mutation, auction }) => {
  const [deleteAuction, { loading: updating }] = useMutation(mutation);
  const onSubmit = useCallback(() => {
    deleteAuction({
      variables: { id: auction.id },
    }).then(() => {
      if (onConfirm) {
        onConfirm(auction);
        onClose();
      } else {
        window.location.reload(false);
      }
    });
  }, [deleteAuction, auction, onConfirm, onClose]);

  return (
    <Dialog className="fw-normal text-center" open={open} title="Confirm deleting" onClose={onClose}>
      <DialogContent>
        Do you want to delete an auction: <b>{auction.title}</b>?
      </DialogContent>

      <DialogActions className="justify-content-center flex-column-reverse flex-sm-row pt-0 pt-sm-2">
        <Button
          className={clsx(styles.actionBtn, 'ms-0 me-sm-auto p-3')}
          disabled={updating}
          size="sm"
          variant="light"
          onClick={onClose}
        >
          Cancel
        </Button>
        <AsyncButton className={styles.actionBtn} loading={updating} variant="secondary" onClick={onSubmit}>
          Submit
        </AsyncButton>
      </DialogActions>
    </Dialog>
  );
};
