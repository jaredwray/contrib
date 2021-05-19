import { FC, useCallback } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import Dialog from 'src/components/Dialog';
import DialogContent from 'src/components/Dialog/DialogContent';
import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';
import { Auction } from 'src/types/Auction';

interface Props {
  open: boolean;
  onClose: () => void;
  mutation: DocumentNode;
  auction: Auction;
}

export const Modal: FC<Props> = ({ open, onClose, mutation, auction }) => {
  const [updateAuctionfairMarketValue] = useMutation(mutation);

  const onSubmit = useCallback(
    ({ fairMarketValue }: { fairMarketValue: string }) => {
      if (fairMarketValue) {
        updateAuctionfairMarketValue({
          variables: { id: auction?.id, fairMarketValue },
        }).then(() => window.location.reload(false));
      }
    },
    [updateAuctionfairMarketValue, auction?.id],
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
            <Button className="text-label" type="submit" variant="secondary">
              Submit
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
