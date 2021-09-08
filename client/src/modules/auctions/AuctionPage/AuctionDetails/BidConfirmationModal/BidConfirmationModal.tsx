import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';

import { useMutation } from '@apollo/client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElement, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import clsx from 'clsx';
import { isPast } from 'date-fns';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

import { BuyAuctionMutation } from 'src/apollo/queries/auctions';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import { MakeAuctionBidMutation } from 'src/apollo/queries/bids';
import AsyncButton from 'src/components/AsyncButton';
import Dialog from 'src/components/Dialog';
import DialogActions from 'src/components/Dialog/DialogActions';
import DialogContent from 'src/components/Dialog/DialogContent';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

import styles from './BidConfirmationModal.module.scss';
import CardInfo from './CardInfo';
import StripeInput from './StripeInput';

export interface BidConfirmationRef {
  placeBid: (amount: Dinero.Dinero) => void;
}

interface Props {
  auctionId: string;
  isBuying: boolean;
  setIsBuying: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

export const BidConfirmationModal = forwardRef<BidConfirmationRef, Props>(
  ({ auctionId, isBuying, setIsBuying }, ref) => {
    const [updateAuction] = useMutation(BuyAuctionMutation);
    const stripe = useStripe();
    const elements = useElements();
    const { addToast } = useToasts();

    const [cardComplete, setCardComplete] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [activeBid, setActiveBid] = useState<Dinero.Dinero | null>(null);
    const [newCard, setNewCard] = useState(false);
    const { account } = useContext(UserAccountContext);

    const [makeBid] = useMutation(MakeAuctionBidMutation);
    const [registerPaymentMethod] = useMutation(RegisterPaymentMethodMutation);

    const paymentInformation = account?.paymentInformation;

    const expired = isPast(new Date(paymentInformation?.cardExpirationYear!, paymentInformation?.cardExpirationMonth!));

    const hasPaymentMethod = Boolean(paymentInformation);
    const title = hasPaymentMethod ? 'Confirm bid' : 'Payment information';
    const buyingTitle = 'Confirm buying';

    const handleClose = useCallback(() => {
      setActiveBid(null);
      setNewCard(false);
      setIsBuying(false);
    }, [setIsBuying]);

    const handleAddCard = useCallback(() => {
      setNewCard(true);
    }, []);

    const handleCardInputChange = useCallback((event: StripeCardElementChangeEvent) => {
      setCardComplete(event.complete);
    }, []);

    const handleNewCardCancelBtnClick = useCallback(() => {
      setNewCard(false);
    }, [setNewCard]);

    const handleBiding = useCallback(async () => {
      if (!elements || !activeBid) {
        return;
      }

      setSubmitting(true);

      try {
        if (!paymentInformation || newCard) {
          const tokenResult = await stripe?.createToken(elements.getElement(CardElement) as StripeCardElement);
          if (tokenResult?.error) {
            setSubmitting(false);
            addToast(tokenResult.error.message, { autoDismiss: true, appearance: 'error' });
            return;
          }
          const token = tokenResult?.token ?? { id: '' };

          await registerPaymentMethod({ variables: { token: token.id } });
        }

        await makeBid({ variables: { id: auctionId, bid: activeBid?.toObject() } });

        setSubmitting(false);
        setActiveBid(null);
        setNewCard(false);
        addToast(`Your bid of ${activeBid.toFormat('$0,0')} has been accepted.`, {
          appearance: 'success',
          autoDismiss: true,
        });
      } catch (error) {
        setSubmitting(false);
        setNewCard(false);
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    }, [elements, activeBid, paymentInformation, newCard, makeBid, auctionId, addToast, stripe, registerPaymentMethod]);

    const handleBuying = useCallback(async () => {
      setSubmitting(true);

      try {
        await updateAuction({ variables: { id: auctionId } });
        addToast(`Thank you for your purchase!`, { autoDismiss: true, appearance: 'success' });
        handleClose();
      } catch (error) {
        setSubmitting(false);
        setNewCard(false);
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    }, [auctionId, updateAuction, addToast, handleClose]);

    useImperativeHandle(ref, () => ({
      placeBid: (amount: Dinero.Dinero) => {
        setActiveBid(amount);
      },
    }));

    useEffect(() => setNewCard(false), []);
    const buttonsAreDisabled = isSubmitting || expired || ((newCard || !paymentInformation) && !cardComplete);

    return (
      <Dialog
        backdrop="static"
        keyboard={false}
        open={Boolean(activeBid)}
        title={isBuying ? buyingTitle : title}
        onClose={handleClose}
      >
        <DialogContent>
          <div className={clsx(styles.cardInputWrapper, 'text--body')}>
            {isBuying || (
              <p>
                We need your card number in order to place your bid. Card will be charged only after auction end, in
                case your bid is winning.
              </p>
            )}
            <p>Please make sure this card has enough available funds at time of auction finalization.</p>

            {(expired || paymentInformation) && !newCard && (
              <CardInfo
                expired={expired}
                isSubmitting={isSubmitting}
                paymentInfo={paymentInformation}
                onNewCardAdd={handleAddCard}
              />
            )}
            {(!paymentInformation || newCard) && (
              <StripeInput
                disabled={isSubmitting}
                showCancelBtn={Boolean(paymentInformation)}
                onCancel={handleNewCardCancelBtnClick}
                onChange={handleCardInputChange}
              />
            )}

            <p className="text-center pt-0 pt-sm-3 mb-0">
              {isBuying ? 'Price is' : 'Your bid is'}
              <span className="pl-1 font-weight-bold">{activeBid?.toFormat('$0,0')}</span>
            </p>
          </div>
        </DialogContent>

        <DialogActions className="justify-content-center flex-column-reverse flex-sm-row pt-0 pt-sm-2">
          <Button
            className={clsx(styles.actionBtn, 'ml-0 mr-sm-auto p-3')}
            disabled={buttonsAreDisabled}
            size="sm"
            variant="light"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <AsyncButton
            className={styles.actionBtn}
            disabled={buttonsAreDisabled}
            loading={isSubmitting}
            variant="secondary"
            onClick={isBuying ? handleBuying : handleBiding}
          >
            {isBuying ? 'Buy it now' : 'Confirm bidding'}
          </AsyncButton>
        </DialogActions>
      </Dialog>
    );
  },
);

BidConfirmationModal.displayName = 'PaymentConfirmationModal';
