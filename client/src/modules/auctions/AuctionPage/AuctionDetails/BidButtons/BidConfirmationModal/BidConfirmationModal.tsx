import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';

import { useMutation } from '@apollo/client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElement, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import clsx from 'clsx';
import { isPast } from 'date-fns';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { BuyAuctionMutation } from 'src/apollo/queries/auctions';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import { MakeAuctionBidMutation } from 'src/apollo/queries/bids';
import AsyncButton from 'src/components/buttons/AsyncButton';
import { CardInput } from 'src/components/forms/inputs/CardInput';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Dialog from 'src/components/modals/Dialog';
import DialogActions from 'src/components/modals/Dialog/DialogActions';
import DialogContent from 'src/components/modals/Dialog/DialogContent';
import { useShowNotification } from 'src/helpers/useShowNotification';

import styles from './BidConfirmationModal.module.scss';

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
    const [buyAuction] = useMutation(BuyAuctionMutation);
    const stripe = useStripe();
    const elements = useElements();
    const { showMessage, showError } = useShowNotification();

    const [cardComplete, setCardComplete] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [activeBid, setActiveBid] = useState<Dinero.Dinero | null>(null);
    const [newCard, setNewCard] = useState(false);
    const { account } = useContext(UserAccountContext);

    const [makeBid] = useMutation(MakeAuctionBidMutation);
    const [registerPaymentMethod] = useMutation(RegisterPaymentMethodMutation, {
      refetchQueries: [{ query: MyAccountQuery }],
    });
    const paymentInformation = account?.paymentInformation;
    const expired = isPast(new Date(paymentInformation?.cardExpirationYear!, paymentInformation?.cardExpirationMonth!));
    const title = 'Place Your Bid';
    const buyingTitle = 'Buy it now';

    const handleClose = useCallback(() => {
      setActiveBid(null);
      setNewCard(false);
      setIsBuying(false);
    }, [setIsBuying]);
    const handleAddCard = useCallback(() => setNewCard(true), []);
    const handleCardInputChange = useCallback(
      (event: StripeCardElementChangeEvent) => setCardComplete(event.complete),
      [],
    );
    const handleNewCardCancelBtnClick = useCallback(() => setNewCard(false), [setNewCard]);
    const handleRegisterPayment = useCallback(
      async (paymentInformation, newCard) => {
        if (!paymentInformation || newCard) {
          const tokenResult = await stripe?.createToken(elements!.getElement(CardElement) as StripeCardElement);
          if (tokenResult?.error) {
            setSubmitting(false);
            showError(tokenResult.error.message);
            return;
          }
          const token = tokenResult?.token ?? { id: '' };

          await registerPaymentMethod({ variables: { token: token.id } });
        }
      },
      [elements, registerPaymentMethod, showError, stripe],
    );

    const handleBiding = useCallback(async () => {
      if (!elements || process.title === 'browser' ? !activeBid : false) return;

      setSubmitting(true);

      try {
        await handleRegisterPayment(paymentInformation, newCard);

        await makeBid({ variables: { id: auctionId, bid: activeBid?.toObject() } });

        setSubmitting(false);
        setActiveBid(null);
        setNewCard(false);
        showMessage(`Your bid of ${activeBid!.toFormat('$0,0')} was accepted.`);
      } catch (error: any) {
        setSubmitting(false);
        setNewCard(false);
        showError(error.message);
      }
    }, [
      elements,
      activeBid,
      paymentInformation,
      newCard,
      makeBid,
      auctionId,
      showMessage,
      showError,
      handleRegisterPayment,
    ]);

    const handleBuying = useCallback(async () => {
      setSubmitting(true);
      try {
        await handleRegisterPayment(paymentInformation, newCard);

        await buyAuction({ variables: { id: auctionId } });
        showMessage(`Thank you for your purchase!`);
        handleClose();
      } catch (error: any) {
        setSubmitting(false);
        setNewCard(false);
        showError(error.message);
      }
    }, [
      auctionId,
      buyAuction,
      showError,
      showMessage,
      handleRegisterPayment,
      handleClose,
      paymentInformation,
      newCard,
    ]);

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
        className={styles.modalTitle}
        keyboard={false}
        open={process.title === 'browser' ? Boolean(activeBid) : true}
        title={isBuying ? buyingTitle : title}
        onClose={handleClose}
      >
        <DialogContent className="pt-0 pb-0">
          <div className={clsx(styles.cardInputWrapper, 'text--body')}>
            {isBuying ? (
              <p>Please make sure this card has enough available funds at time of auction finalization.</p>
            ) : (
              <p>
                First, we need some payment information to secure your bid. Your card will only be charged after the
                auction ends (if you win).
              </p>
            )}

            <CardInput
              expired={expired}
              handleAddCard={handleAddCard}
              isSubmitting={isSubmitting}
              newCard={newCard}
              paymentInformation={paymentInformation}
              stripeInputStyles={styles.input}
              onCancel={handleNewCardCancelBtnClick}
              onChange={handleCardInputChange}
            />
            <p className="text-center pt-4 mb-4">
              <span className="text-super-headline">{activeBid?.toFormat('$0,0')}</span>
            </p>
            <hr />
            <p className="text-label">
              By clicking confirm, you acknowledge your item cannot be shipped to: Alabama, Hawaii, Illinois,
              Massachusetts, Mississippi, or South Carolina.
            </p>
          </div>
        </DialogContent>

        <DialogActions className="d-block pt-0 pt-sm-2">
          <AsyncButton
            className={clsx(styles.actionBtn, 'ms-0 me-sm-auto p-3')}
            data-test-id="bid-button"
            disabled={buttonsAreDisabled}
            loading={isSubmitting}
            variant="secondary"
            onClick={isBuying ? handleBuying : handleBiding}
          >
            {isBuying ? 'Buy it now' : 'Confirm'}
          </AsyncButton>
          <Button
            className={clsx(styles.actionBtn, styles.cancelBtn, 'ms-0 me-sm-auto p-3')}
            disabled={buttonsAreDisabled}
            size="sm"
            variant="link"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

BidConfirmationModal.displayName = 'PaymentConfirmationModal';
