import { useContext, useCallback, useEffect, useState, useRef, BaseSyntheticEvent } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { format } from 'date-fns';
import Dinero from 'dinero.js';
import { Row, Spinner, Col } from 'react-bootstrap';
import { useHistory, useParams, Link } from 'react-router-dom';

import { AuctionQuery, CalculateShippingCostQuery, ShippingRegistrationMutation } from 'src/apollo/queries/auctions';
import DeliveryCardInput from 'src/components/DeliveryCardInput';
import { DeliveryTextBlock } from 'src/components/DeliveryTextBlock';
import DialogActions from 'src/components/Dialog/DialogActions';
import Form from 'src/components/Form/Form';
import SelectField from 'src/components/Form/SelectField';
import Select from 'src/components/Select';
import { SubmitButton } from 'src/components/SubmitButton/SubmitButton';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { UserDialogLayout } from 'src/components/UserDialogLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { USAStates } from 'src/modules/auctions/delivery/DeliveryAddressPage/USAStates';
import { deliveryMethods, cardTypes } from 'src/modules/auctions/delivery/DeliveryPaymentPage/consts';
import { Modal } from 'src/modules/auctions/delivery/DeliveryPaymentPage/Modal';
import { AuctionDeliveryStatus } from 'src/types/Auction';

import { MutationProps } from './ModalMutationProps';
import styles from './styles.module.scss';

export default function DeliveryPricePage() {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const { showWarning } = useShowNotification();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();
  const [showDialog, setShowDialog] = useState(false);
  const [modalProps, setModalProps] = useState<MutationProps | null>(null);
  const selectedDeliveryMethod = useRef(deliveryMethods[0].value);
  const month = useRef<HTMLInputElement | null>(null);
  const year = useRef<HTMLInputElement | null>(null);
  const cvc = useRef<HTMLInputElement | null>(null);

  const initialDeliveryMethod = deliveryMethods[0].value;

  const [ExecuteAuctionData, { loading: executeAuctionLoading, data: auctionData }] = useLazyQuery(AuctionQuery, {
    fetchPolicy: 'network-only',
  });

  const [CalculateShippingCost, { loading: calculateShippingCostLoading, data: shippingCostData }] = useLazyQuery(
    CalculateShippingCostQuery,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  useEffect(() => {
    ExecuteAuctionData({ variables: { id: auctionId } });
    CalculateShippingCost({
      variables: {
        auctionId,
        deliveryMethod: initialDeliveryMethod,
      },
    });
  }, [ExecuteAuctionData, auctionId, initialDeliveryMethod, CalculateShippingCost]);

  const shippingCost = shippingCostData?.calculateShippingCost;

  const handleAccepting = useCallback(
    ({
      type,
      number,
      expirationDateMonth,
      expirationDateYear,
      securityCode,
      deliveryMethod,
    }: {
      type: string;
      number: string;
      expirationDateMonth: string;
      expirationDateYear: string;
      securityCode: string;
      deliveryMethod: string;
    }) => {
      if (!type || !number || !expirationDateMonth || !expirationDateYear || !securityCode || !deliveryMethod) {
        showWarning('Please, check the data');
        return;
      }
      setShowDialog(true);
      setModalProps({
        auctionId,
        type,
        number,
        expirationDateMonth,
        expirationDateYear,
        securityCode,
        timeInTransit: shippingCost?.timeInTransit,
        deliveryMethod: selectedDeliveryMethod.current,
      });
    },
    [showWarning, auctionId, shippingCost?.timeInTransit],
  );

  if (!auctionData) {
    return null;
  }

  if (!account) {
    RedirectWithReturnAfterLogin(`/auctions/${auctionId}/delivery/payment`);
    return null;
  }

  const { auction } = auctionData;
  const isWinner = auction?.winner?.mongodbId === account?.mongodbId;

  if (!isWinner) {
    history.goBack();
    return null;
  }

  if (auction?.delivery?.status === AuctionDeliveryStatus.PAID) {
    history.push(`/auctions/${auctionId}/delivery/status`);
    return null;
  }

  if (
    auction?.delivery?.status !== AuctionDeliveryStatus.ADDRESS_PROVIDED &&
    auction?.delivery?.status !== AuctionDeliveryStatus.PAID
  ) {
    history.push(`/auctions/${auctionId}/delivery/address`);
    return null;
  }

  const { name, state, city, street, zipCode, phoneNumber } = auction.delivery.address;

  const handleChange = (deliveryMethod: string) => {
    selectedDeliveryMethod.current = deliveryMethod;
    CalculateShippingCost({
      variables: {
        auctionId,
        deliveryMethod: selectedDeliveryMethod.current,
      },
    });
  };

  const incomingState = USAStates.find((option) => option.value === state)?.label;
  const { title } = auction;

  if (!isWinner) {
    history.push(`/`);
    return null;
  }

  const textBlock = (
    <DeliveryTextBlock
      city={city}
      incomingState={incomingState}
      loading={executeAuctionLoading}
      name={name}
      phoneNumber={phoneNumber}
      state={state}
      street={street}
      subtitle="Your package will be delivered to:"
      zipCode={zipCode}
    >
      <p className="text-headline pt-2">
        Please choose the delivery method or
        {
          <Link to={`/auctions/${auctionId}/delivery/address`}>
            {<span className={styles.markedText}>go back</span>}
          </Link>
        }
        to edit the recipient or address.
      </p>
    </DeliveryTextBlock>
  );

  setPageTitle(`Delivery price for ${title} auction`);

  const disabled = calculateShippingCostLoading || executeAuctionLoading;
  const arrivalDate = new Date(shippingCost?.timeInTransit || null);

  const focusOnAtherInput = (e: BaseSyntheticEvent) => {
    const { name, maxLength, value } = e.target;
    if (maxLength === value.length && name === 'number') {
      month.current?.focus();
    }
    if (maxLength === value.length && name === 'expirationDateMonth') {
      year.current?.focus();
    }
    if (maxLength === value.length && name === 'expirationDateYear') {
      cvc.current?.focus();
    }
  };

  return (
    <UserDialogLayout textBlock={textBlock} title="UPS Delivery">
      <Form
        initialValues={{
          auctionId: modalProps?.auctionId || '',
          securityCode: modalProps?.securityCode || '',
          timeInTransit: modalProps?.timeInTransit || '',
          number: modalProps?.number || '',
          expirationDateMonth: modalProps?.expirationDateMonth || '',
          expirationDateYear: modalProps?.expirationDateYear || '',
          deliveryMethod: deliveryMethods[0].value,
          type: modalProps?.type || cardTypes[0].value,
        }}
        onSubmit={handleAccepting}
      >
        <Row className="d-flex align-items-baseline">
          <span className="pt-1 pb-1 text-label">Delivery Method</span>
        </Row>
        <Row className="d-flex align-items-baseline w-100 mb-2">
          <div className="w-100">
            <Select
              className={styles.select}
              disabled={disabled}
              options={deliveryMethods}
              selected={deliveryMethods[0]}
              onChange={handleChange}
            />
          </div>
        </Row>
        {calculateShippingCostLoading ? (
          <Row className={clsx(styles.deliveryInfo, 'justify-content-center align-items-center w-100')}>
            <Spinner animation="border" size="sm" />
          </Row>
        ) : (
          <div className={styles.deliveryInfo}>
            <Row className="mb-2 justify-content-center w-100">
              <span className="pt-1 pb-1">
                {`Delivery price: ${Dinero(shippingCost?.deliveryPrice).toFormat('$0,0.00')}`}
              </span>
            </Row>
            <Row className="mb-2 justify-content-center w-100">
              <span className="pt-1 pb-1">{`Estimated arrival date: ${format(arrivalDate, 'MM/dd/yyyy')}`}</span>
            </Row>
          </div>
        )}

        <Row className="d-flex align-items-baseline w-100 mb-1">
          <SelectField
            className={styles.select}
            isDisabled={disabled}
            name="type"
            options={cardTypes}
            selected={cardTypes[0]}
          />
        </Row>

        <Row className="d-flex align-items-baseline w-100">
          <DeliveryCardInput
            disabled={disabled}
            labelText="Card Number"
            maxLength={16}
            name="number"
            type="tel"
            onInput={focusOnAtherInput}
          />
        </Row>
        <Row className="d-flex align-items-baseline w-100 ">
          <Col className="d-flex align-items-baseline pl-0">
            <DeliveryCardInput
              ref={month}
              disabled={disabled}
              labelText="Month"
              maxLength={2}
              name="expirationDateMonth"
              type="tel"
              onInput={focusOnAtherInput}
            />
          </Col>
          <Col className="d-flex align-items-baseline">
            <DeliveryCardInput
              ref={year}
              disabled={disabled}
              labelText="Year"
              maxLength={2}
              name="expirationDateYear"
              type="tel"
              onInput={focusOnAtherInput}
            />
          </Col>
          <Col className="d-flex align-items-baseline pr-0">
            <span className="glyphicon glyphicon-print"></span>
            <DeliveryCardInput
              ref={cvc}
              disabled={disabled}
              labelText="CVC"
              maxLength={4}
              name="securityCode"
              prompt={true}
              type="password"
              onInput={focusOnAtherInput}
            />
          </Col>
        </Row>
        <Row>
          <DialogActions className="justify-content-between flex-column-reverse flex-sm-row p-0 w-100">
            <div className={clsx(disabled ? styles.actionLinkWrapper : styles.actionLink)}>
              <Link
                className={clsx(disabled ? styles.actionLinkDisabled : styles.actionLink, 'ml-0 mr-sm-auto p-3')}
                to={`/auctions/${auctionId}/delivery/address`}
              >
                {disabled ? <Spinner animation="border" size="sm" /> : 'Back'}
              </Link>
            </div>
            <SubmitButton className="w-100" disabled={disabled}>
              {disabled ? <Spinner animation="border" size="sm" /> : 'Submit'}
            </SubmitButton>
          </DialogActions>
        </Row>
      </Form>
      <Modal
        mutation={ShippingRegistrationMutation}
        mutationProps={modalProps}
        open={showDialog}
        shippingCost={shippingCost?.deliveryPrice}
        onClose={() => setShowDialog(false)}
      />
    </UserDialogLayout>
  );
}
