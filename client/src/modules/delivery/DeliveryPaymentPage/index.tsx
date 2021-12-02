import { useContext, useCallback, useEffect, useRef, useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import type { StripeCardElement, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import clsx from 'clsx';
import { format, isPast } from 'date-fns';
import Dinero from 'dinero.js';
import { Row, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { AuctionQuery, CalculateShippingCostQuery, ShippingRegistrationMutation } from 'src/apollo/queries/auctions';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import { CardInput } from 'src/components/forms/inputs/CardInput';
import Select from 'src/components/forms/selects/Select';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import StepRow from 'src/components/layouts/StepByStepPageLayout/Row';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { deliveryMethods } from 'src/modules/delivery/DeliveryPaymentPage/consts';
import { AuctionDeliveryStatus } from 'src/types/Auction';

import styles from './styles.module.scss';

export default function DeliveryPricePage() {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const elements = useElements();
  const history = useHistory();
  const stripe = useStripe();
  const { showError, showMessage } = useShowNotification();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const [cardComplete, setCardComplete] = useState(false);
  const [newCard, setNewCard] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const [RegisterPaymentMethod] = useMutation(RegisterPaymentMethodMutation);
  const [ExecuteAuctionData, { loading: executeAuctionLoading, data: auctionData }] = useLazyQuery(AuctionQuery, {
    fetchPolicy: process.title === 'browser' ? 'network-only' : 'cache-and-network',
  });
  const [CalculateShippingCost, { loading: calculateShippingCostLoading, data: shippingCostData }] = useLazyQuery(
    CalculateShippingCostQuery,
    {
      fetchPolicy: 'cache-and-network',
    },
  );
  const [ShippingRegistration] = useMutation(ShippingRegistrationMutation);

  const selectedDeliveryMethod = useRef(deliveryMethods[0].value);
  const initialDeliveryMethod = deliveryMethods[0].value;
  const paymentInformation = account?.paymentInformation;
  const expired = isPast(new Date(paymentInformation?.cardExpirationYear!, paymentInformation?.cardExpirationMonth!));

  const shippingCost = shippingCostData?.calculateShippingCost;
  const buttonsAreDisabled = expired || ((newCard || !paymentInformation) && !cardComplete);
  const selectisDisabled = calculateShippingCostLoading || executeAuctionLoading || isSubmitting;
  const arrivalDate = new Date(shippingCost?.timeInTransit || null);

  useEffect(() => setNewCard(false), []);

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/delivery/address`);
  }, [auctionId, history]);

  useEffect(() => {
    ExecuteAuctionData({ variables: { id: auctionId } });
    CalculateShippingCost({
      variables: {
        auctionId,
        deliveryMethod: initialDeliveryMethod,
      },
    });
  }, [ExecuteAuctionData, auctionId, initialDeliveryMethod, CalculateShippingCost]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    if (!elements) {
      return;
    }
    try {
      if (!paymentInformation || newCard) {
        const tokenResult = await stripe?.createToken(elements.getElement(CardElement) as StripeCardElement);
        if (tokenResult?.error) {
          setSubmitting(false);
          showError(tokenResult.error.message || '');
          return;
        }
        const token = tokenResult?.token ?? { id: '' };
        await RegisterPaymentMethod({ variables: { token: token.id } });
      }
      await ShippingRegistration({
        variables: {
          auctionId,
          timeInTransit: shippingCost?.timeInTransit,
          deliveryMethod: selectedDeliveryMethod.current,
        },
      });
      setSubmitting(false);
      setNewCard(false);
      showMessage('Auction delivery status has been changed');
      history.push(`/auctions/${auctionId}/delivery/status`);
    } catch (error: any) {
      setSubmitting(false);
      setNewCard(false);
      showError(error.message);
    }
  }, [
    elements,
    newCard,
    paymentInformation,
    stripe,
    auctionId,
    history,
    shippingCost?.timeInTransit,
    RegisterPaymentMethod,
    ShippingRegistration,
    showError,
    showMessage,
  ]);

  const handleAddCard = useCallback(() => {
    setNewCard(true);
  }, []);

  const handleNewCardCancelBtnClick = useCallback(() => {
    setNewCard(false);
  }, [setNewCard]);

  const handleCardInputChange = useCallback((event: StripeCardElementChangeEvent) => {
    setCardComplete(event.complete);
  }, []);

  const handleDeliveryMethodChange = (deliveryMethod: string) => {
    selectedDeliveryMethod.current = deliveryMethod;
    CalculateShippingCost({
      variables: {
        auctionId,
        deliveryMethod: selectedDeliveryMethod.current,
      },
    });
  };

  if (!auctionData) {
    return null;
  }

  if (!account) {
    RedirectWithReturnAfterLogin(`/auctions/${auctionId}/delivery/payment`);
    return null;
  }

  const { auction } = auctionData;
  const isWinner = auction?.winner?.mongodbId === account?.mongodbId;

  if (
    auction?.delivery?.status === AuctionDeliveryStatus.DELIVERY_PAID ||
    auction?.delivery?.status === AuctionDeliveryStatus.DELIVERY_PAYMENT_FAILED
  ) {
    history.push(`/auctions/${auctionId}/delivery/status`);
    return null;
  }

  if (auction?.delivery?.status !== AuctionDeliveryStatus.ADDRESS_PROVIDED) {
    history.push(`/auctions/${auctionId}/delivery/address`);
    return null;
  }

  if (!isWinner) {
    history.replace(`/`);
    return null;
  }

  setPageTitle(`Delivery price for ${auction.title} auction`);

  return (
    <StepByStepPageLayout
      disabled={buttonsAreDisabled}
      header="Delivery"
      loading={calculateShippingCostLoading || executeAuctionLoading || isSubmitting}
      prevAction={handlePrevAction}
      progress={66.66}
      step="2"
      title="Delivery payment"
      onSubmit={handleSubmit}
    >
      <StepRow description="Choose a delivery method and pay for it">
        <Row className="d-flex align-items-baseline">
          <span className="pt-1 pb-1 text-label">Delivery Method</span>
        </Row>
        <Row className="d-flex align-items-baseline w-100 mb-2">
          <div className="w-100">
            <Select
              className={styles.select}
              disabled={selectisDisabled}
              options={deliveryMethods}
              selected={deliveryMethods[0]}
              onChange={handleDeliveryMethodChange}
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
            <Row className="justify-content-center w-100">
              <span className="pt-1 pb-1">{`Estimated arrival date: ${format(arrivalDate, 'MM/dd/yyyy')}`}</span>
            </Row>
          </div>
        )}
        <CardInput
          cancelButtonStyles={styles.deliveryCardCancelButton}
          cardInfoStyles={styles.deliveryCardInfo}
          expired={expired}
          handleAddCard={handleAddCard}
          isSubmitting={isSubmitting}
          newCard={newCard}
          paymentInformation={paymentInformation}
          stripeInputStyles={styles.deliveryStripeInput}
          onCancel={handleNewCardCancelBtnClick}
          onChange={handleCardInputChange}
        />
      </StepRow>
    </StepByStepPageLayout>
  );
}
