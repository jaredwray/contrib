import { forwardRef, useCallback, useContext, useImperativeHandle, useMemo, useState } from 'react';

import { useMutation } from '@apollo/client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElement, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import Dinero from 'dinero.js';
import { Button, Modal } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

import { MakeAuctionBidMutation } from 'src/apollo/queries/auctions';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

import styles from './BidConfirmationModal.module.scss';

export interface BidConfirmationRef {
  placeBid: (amount: Dinero.Dinero) => void;
}

interface Props {
  auctionId: string;
}

export const BidConfirmationModal = forwardRef<BidConfirmationRef, Props>(({ auctionId }, ref) => {
  const stripe = useStripe();
  const elements = useElements();

  const { addToast } = useToasts();
  const [isSubmitting, setSubmitting] = useState(false);
  const [activeBid, setActiveBid] = useState<Dinero.Dinero | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const { account } = useContext(UserAccountContext);
  const [makeBid] = useMutation(MakeAuctionBidMutation);
  const [registerPaymentMethod] = useMutation(RegisterPaymentMethodMutation);

  const handleClose = useCallback(() => {
    setActiveBid(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!elements || !activeBid) {
      return;
    }

    setSubmitting(true);

    try {
      const tokenResult = await stripe?.createToken(elements.getElement(CardElement) as StripeCardElement);
      if (tokenResult?.error) {
        setSubmitting(false);
        addToast(tokenResult.error.message, { autoDismiss: true, appearance: 'error' });
        return;
      }
      const token = tokenResult?.token ?? { id: '' };

      await registerPaymentMethod({ variables: { token: token.id } });
      await makeBid({ variables: { id: auctionId, bid: activeBid?.toObject() } });
      setSubmitting(false);
      setActiveBid(null);
      addToast(`Your bid of ${activeBid.toFormat('$0,0.00')} has been accepted.`, { appearance: 'success' });
    } catch (error) {
      setSubmitting(false);
      addToast(error.message, { autoDismiss: true, appearance: 'error' });
    }
  }, [stripe, elements, activeBid, auctionId, addToast, makeBid, registerPaymentMethod]);

  const cardOptions = useMemo(
    () => ({
      disabled: isSubmitting,
    }),
    [isSubmitting],
  );

  useImperativeHandle(ref, () => ({
    placeBid: (amount: Dinero.Dinero) => {
      setActiveBid(amount);
    },
  }));

  const handleCardInputChange = useCallback((event: StripeCardElementChangeEvent) => {
    setCardComplete(event.complete);
  }, []);

  const hasPaymentMethod = Boolean(account?.paymentInformation);
  const title = hasPaymentMethod ? 'Confirm bid' : 'Payment information';

  return (
    <Modal backdrop="static" keyboard={false} show={Boolean(activeBid)} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.cardInputWrapper}>
          <p>
            We need your card number in order to place your bid. Card will be charged only after auction end, in case
            your bid is winning.
          </p>
          <p>Please make sure this card has enough available funds at time of auction finalization.</p>
          <CardElement options={cardOptions} onChange={handleCardInputChange} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button block disabled={!cardComplete || isSubmitting} variant="primary" onClick={handleSubmit}>
          Confirm bidding {activeBid?.toFormat('$0,0.00')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

BidConfirmationModal.displayName = 'PaymentConfirmationModal';
