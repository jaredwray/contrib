import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';

import { useMutation } from '@apollo/client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElement, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import clsx from 'clsx';
import { isPast } from 'date-fns';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

import { MakeAuctionBidMutation } from 'src/apollo/queries/auctions';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import Dialog from 'src/components/Dialog';
import DialogActions from 'src/components/DialogActions';
import DialogContent from 'src/components/DialogContent';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

import styles from './BidConfirmationModal.module.scss';
import StripeInput from './StripeInput';

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

  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [activeBid, setActiveBid] = useState<Dinero.Dinero | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const { account } = useContext(UserAccountContext);

  const [makeBid] = useMutation(MakeAuctionBidMutation);
  const [registerPaymentMethod] = useMutation(RegisterPaymentMethodMutation);

  const paymentInformation = account?.paymentInformation;

  const expired = isPast(new Date(paymentInformation?.cardExpirationYear!, paymentInformation?.cardExpirationMonth!));
  const hasPaymentMethod = Boolean(paymentInformation);
  const title = hasPaymentMethod ? 'Confirm bid' : 'Payment information';

  const handleClose = useCallback(() => {
    setActiveBid(null);
  }, []);

  const handleAddCard = useCallback(() => {
    setShowSubmitButton(true);
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

  const handleCardInputChange = useCallback((event: StripeCardElementChangeEvent) => {
    setCardComplete(event.complete);
  }, []);

  useImperativeHandle(ref, () => ({
    placeBid: (amount: Dinero.Dinero) => {
      setActiveBid(amount);
    },
  }));

  useEffect(() => {
    setShowSubmitButton(!expired);
  }, [expired]);

  const renderExpiredBlock = () => {
    return (
      <div className={styles.expiredBlock}>
        <p className="text-center mb-1">
          {paymentInformation?.cardBrand} ending *{paymentInformation?.cardNumberLast4}, exp.{' '}
          {paymentInformation?.cardExpirationMonth}/{paymentInformation?.cardExpirationYear}
        </p>
        <Button
          className={clsx(styles.addCardBtn, 'mx-auto text--body')}
          size="sm"
          variant="link"
          onClick={handleAddCard}
        >
          Use another card
        </Button>
      </div>
    );
  };

  return (
    <Dialog backdrop="static" keyboard={false} open={Boolean(activeBid)} title={title} onClose={handleClose}>
      <DialogContent>
        <div className={styles.cardInputWrapper}>
          <p>
            We need your card number in order to place your bid. Card will be charged only after auction end, in case
            your bid is winning.
          </p>
          <p>Please make sure this card has enough available funds at time of auction finalization.</p>
          {showSubmitButton ? (
            <StripeInput disabled={isSubmitting} onChange={handleCardInputChange} />
          ) : (
            renderExpiredBlock()
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button block disabled={!cardComplete || isSubmitting} variant="primary" onClick={handleSubmit}>
          Confirm bidding {activeBid?.toFormat('$0,0.00')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

BidConfirmationModal.displayName = 'PaymentConfirmationModal';
