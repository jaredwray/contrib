import { FC, useCallback, useMemo } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import clsx from 'clsx';
import Dinero, { DineroObject } from 'dinero.js';

import AsyncButton from 'src/components/buttons/AsyncButton';
import Form from 'src/components/forms/Form/Form';
import MoneyField from 'src/components/forms/inputs/MoneyField';
import Dialog from 'src/components/modals/Dialog';
import DialogContent from 'src/components/modals/Dialog/DialogContent';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  mutation: DocumentNode;
  auction: Auction;
  getAuctionsList: () => void;
}

export const Modal: FC<Props> = ({ open, onClose, mutation, auction, getAuctionsList }) => {
  const [updateAuctionBidStep, { loading: updating }] = useMutation(mutation);
  const { showMessage, showError } = useShowNotification();
  const onSubmit = useCallback(
    ({ bidStep }: { bidStep: DineroObject }) => {
      if (Dinero(bidStep).getAmount() < 1) {
        showError('Bid step value should be more than $1');
        return;
      }
      updateAuctionBidStep({
        variables: { id: auction?.id, bidStep },
      })
        .then(() => {
          onClose();
          getAuctionsList();
          showMessage('Auction bid step value was updated');
        })
        .catch(() => {
          showError('Cannot update auction bid step value');
        });
    },
    [updateAuctionBidStep, auction?.id, showError, showMessage, getAuctionsList, onClose],
  );

  const initialValues = useMemo(
    () => ({
      bidStep: Dinero(auction.bidStep).toObject(),
    }),
    [auction.bidStep],
  );

  return (
    <Dialog open={open} title="Set Bid Step" onClose={onClose}>
      <DialogContent>
        <Form initialValues={initialValues} onSubmit={onSubmit}>
          <MoneyField name="bidStep" title="Enter step price" />
          <hr />
          <div className="float-right">
            <AsyncButton
              className={clsx('text-subhead', styles.button)}
              loading={updating}
              type="submit"
              variant="secondary"
            >
              Submit
            </AsyncButton>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
