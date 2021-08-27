import { FC, useCallback } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Button, Row, Col } from 'react-bootstrap';

import AsyncButton from 'src/components/AsyncButton';
import Dialog from 'src/components/Dialog';
import DialogActions from 'src/components/Dialog/DialogActions';
import DialogContent from 'src/components/Dialog/DialogContent';
import Form from 'src/components/Form/Form';
import InputField from 'src/components/Form/InputField';
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
  const { showMessage, showError, showWarning } = useShowNotification();
  const [updateAuctionMeasures, { loading: updating }] = useMutation(mutation);

  const currentValues = auction.delivery.parcel;

  const onSubmit = useCallback(
    ({ length, width, height, weight }) => {
      if (!length || !width || !height || !weight) {
        showWarning('Please, check the data');
        return;
      }
      updateAuctionMeasures({
        variables: {
          auctionId: auction.id,
          length: `${length}`,
          width: `${width}`,
          height: `${height}`,
          weight: `${weight}`,
          units: 'imperial',
        },
      })
        .then(() => {
          onClose();
          getAuctionsList();
          showMessage('Auction delivery properties were updated');
        })
        .catch(() => {
          showError('Cannot update delivery properties');
        });
    },
    [auction?.id, showError, showMessage, showWarning, onClose, updateAuctionMeasures, getAuctionsList],
  );

  interface Props {
    title: string;
    children: React.ReactNode;
  }
  const ModalRow: FC<Props> = ({ title, children }) => (
    <Row className="d-flex align-items-baseline">
      <Col>
        <span className="pt-1 pb-1">{title}</span>
      </Col>
      <Col>{children}</Col>
    </Row>
  );

  return (
    <Dialog className="font-weight-normal text-center" open={open} title="Delivery box properties" onClose={onClose}>
      <Form initialValues={currentValues} onSubmit={onSubmit}>
        <DialogContent>
          <ModalRow title="Length in">
            <InputField name="length" placeholder={currentValues?.length.toString()} />
          </ModalRow>
          <ModalRow title="Width in">
            <InputField name="width" placeholder={currentValues?.weight.toString()} />
          </ModalRow>
          <ModalRow title="Height in">
            <InputField name="height" placeholder={currentValues?.height.toString()} />
          </ModalRow>
          <ModalRow title="Weight lb">
            <InputField name="weight" placeholder={currentValues?.weight.toString()} />
          </ModalRow>
        </DialogContent>
        <DialogActions className="justify-content-center flex-column-reverse flex-sm-row pt-0 pt-sm-2">
          <Button
            className={clsx(styles.actionBtn, 'ml-0 mr-sm-auto p-3')}
            disabled={updating}
            size="sm"
            variant="light"
            onClick={onClose}
          >
            Cancel
          </Button>
          <AsyncButton className={clsx(styles.actionBtn)} loading={updating} type="submit" variant="secondary">
            Submit
          </AsyncButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
