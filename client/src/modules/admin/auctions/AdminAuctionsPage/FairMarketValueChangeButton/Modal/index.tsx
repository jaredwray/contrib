import { FC, useCallback } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import clsx from 'clsx';
import Dinero, { DineroObject } from 'dinero.js';

import AsyncButton from 'src/components/AsyncButton';
import Dialog from 'src/components/Dialog';
import DialogContent from 'src/components/Dialog/DialogContent';
import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';
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
  const [updateAuctionfairMarketValue, { loading: updating }] = useMutation(mutation);
  const { showMessage, showError } = useShowNotification();
  const onSubmit = useCallback(
    ({ fairMarketValue }: { fairMarketValue: DineroObject }) => {
      if (Dinero(fairMarketValue).getAmount() < 1) {
        showError('Fair market value should be more than $1');
        return;
      }
      updateAuctionfairMarketValue({
        variables: { id: auction?.id, fairMarketValue },
      })
        .then(() => {
          onClose();
          getAuctionsList();
          showMessage('Auction fair market value was updated');
        })
        .catch(() => {
          showError('Cannot update auction fair market value');
        });
    },
    [updateAuctionfairMarketValue, auction?.id, showError, showMessage, getAuctionsList, onClose],
  );

  const initialValues = {
    fairMarketValue: Dinero(auction.fairMarketValue).toObject(),
  };

  return (
    <Dialog open={open} title="Set Fair Market Value" onClose={onClose}>
      <DialogContent>
        <Form initialValues={initialValues} onSubmit={onSubmit}>
          <MoneyField name="fairMarketValue" title="Enter price" />
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
