import { FC, useCallback } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { format } from 'date-fns';
import Dinero, { DineroObject } from 'dinero.js';
import { Button, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import AsyncButton from 'src/components/AsyncButton';
import Dialog from 'src/components/Dialog';
import DialogActions from 'src/components/Dialog/DialogActions';
import DialogContent from 'src/components/Dialog/DialogContent';
import Form from 'src/components/Form/Form';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { deliveryMethods } from 'src/modules/auctions/delivery/DeliveryPaymentPage/consts';

import { MutationProps } from '../ModalMutationProps';
import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  mutation: DocumentNode;
  mutationProps?: MutationProps | null;
  shippingCost: DineroObject;
}

export const Modal: FC<Props> = ({ open, onClose, mutation, mutationProps, shippingCost }) => {
  const history = useHistory();
  const { showError, showMessage } = useShowNotification();

  const [ShippingRegistration, { loading: shippingRegistrationLoading }] = useMutation(mutation);

  const onSubmit = useCallback(() => {
    ShippingRegistration({
      variables: {
        auctionId: mutationProps?.auctionId,
        type: mutationProps?.type,
        number: mutationProps?.number,
        expirationDate: `${mutationProps?.expirationDateMonth}20${mutationProps?.expirationDateYear}`,
        securityCode: mutationProps?.securityCode,
        deliveryMethod: mutationProps?.deliveryMethod,
        timeInTransit: mutationProps?.timeInTransit,
      },
    })
      .then(() => {
        showMessage('Your address information was updated');
        history.push(`/auctions/${mutationProps?.auctionId}/delivery/status`);
      })
      .catch((error) => {
        showError('Please, check your card data');
        onClose();
      });
  }, [
    ShippingRegistration,
    history,
    onClose,
    showError,
    showMessage,
    mutationProps?.type,
    mutationProps?.number,
    mutationProps?.auctionId,
    mutationProps?.securityCode,
    mutationProps?.timeInTransit,
    mutationProps?.deliveryMethod,
    mutationProps?.expirationDateYear,
    mutationProps?.expirationDateMonth,
  ]);
  const arrivalDate = new Date(mutationProps?.timeInTransit || 0);
  const deliveryMethod = deliveryMethods.find((method) => method.value === mutationProps?.deliveryMethod);
  const confirmContent = () => {
    return (
      <>
        <p>Are you sure you want to pay for delivery?</p>
        <p>
          Delivery Method:<b> {deliveryMethod?.label} </b>
        </p>
        <p>
          Estimated arrival date:<b> {format(arrivalDate, 'MM/dd/yyyy')}</b>
        </p>
        <p>
          Delivery price: <b>{Dinero(shippingCost).toFormat('$0,0.00')}</b>
        </p>
      </>
    );
  };
  return (
    <Dialog className="font-weight-normal text-center" open={open} title="Confirm the payment" onClose={onClose}>
      <Form onSubmit={onSubmit}>
        <DialogContent>{confirmContent()}</DialogContent>

        <DialogActions className="justify-content-center flex-column-reverse flex-sm-row pt-0 pt-sm-2">
          <Button
            className={clsx(styles.actionBtn, 'ml-0 mr-sm-auto p-3')}
            disabled={shippingRegistrationLoading}
            size="sm"
            variant="light"
            onClick={onClose}
          >
            {shippingRegistrationLoading ? <Spinner animation="border" size="sm" /> : 'Cancel'}
          </Button>
          <AsyncButton
            className={clsx(styles.actionBtn)}
            loading={shippingRegistrationLoading}
            type="submit"
            variant="secondary"
          >
            Submit
          </AsyncButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
