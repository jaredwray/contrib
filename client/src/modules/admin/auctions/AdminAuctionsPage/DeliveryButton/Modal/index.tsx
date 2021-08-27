import { FC, useCallback, useState, useMemo } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Button, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap';

import AsyncButton from 'src/components/AsyncButton';
import Dialog from 'src/components/Dialog';
import DialogActions from 'src/components/Dialog/DialogActions';
import DialogContent from 'src/components/Dialog/DialogContent';
import Form from 'src/components/Form/Form';
import InputField from 'src/components/Form/InputField';
import { metricSystem } from 'src/helpers/ParcelProps';
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
  const [measureSystem, setSystem] = useState(true);

  const currentValues = auction.delivery.parcel;

  const type = useMemo(
    () => [
      { value: 1, label: metricSystem[0] },
      { value: 0, label: metricSystem[1] },
    ],
    [],
  );

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
          units: measureSystem ? type[0].label : type[1].label,
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
    [
      auction?.id,
      measureSystem,
      showError,
      showMessage,
      showWarning,
      onClose,
      type,
      updateAuctionMeasures,
      getAuctionsList,
    ],
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
          <Row>
            <ButtonGroup toggle className={clsx(styles.select, 'mt-2 mb-3 w-100')}>
              {type.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  checked={measureSystem === Boolean(radio.value)}
                  className="w-100"
                  name="radio"
                  type="radio"
                  value={radio.value}
                  variant="outline-primary"
                  onChange={(e) => setSystem(Boolean(Number(e.currentTarget.value)))}
                >
                  {radio.label}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Row>
          <ModalRow title={`Length (${measureSystem ? 'in' : 'cm'})`}>
            <InputField name="length" placeholder={currentValues?.length.toString()} />
          </ModalRow>
          <ModalRow title={`Width (${measureSystem ? 'in' : 'cm'})`}>
            <InputField name="width" placeholder={currentValues?.weight.toString()} />
          </ModalRow>
          <ModalRow title={`Height (${measureSystem ? 'in' : 'cm'})`}>
            <InputField name="height" placeholder={currentValues?.height.toString()} />
          </ModalRow>
          <ModalRow title={`Weight (${measureSystem ? 'lb' : 'kg'})`}>
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
