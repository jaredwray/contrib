import { FC, useCallback, useState } from 'react';

import { useMutation } from '@apollo/client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElement, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { isPast } from 'date-fns';
import { Row, Col } from 'react-bootstrap';

import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import { CardInput } from 'src/components/forms/inputs/CardInput';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { UserAccount } from 'src/types/UserAccount';

interface Props {
  account: UserAccount | null;
}

const PaymentInformation: FC<Props> = ({ account }) => {
  const [cardComplete, setCardComplete] = useState(false);
  const [newCard, setNewCard] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const { showMessage, showError } = useShowNotification();
  const stripe = useStripe();
  const elements = useElements();

  const [registerPaymentMethod] = useMutation(RegisterPaymentMethodMutation, {
    refetchQueries: [{ query: MyAccountQuery }],
    /* istanbul ignore next */
    onCompleted() {
      setNewCard(false);
      setCardComplete(false);
      setSubmitting(false);
    },
  });

  const paymentInformation = account?.paymentInformation;
  const expired = isPast(new Date(paymentInformation?.cardExpirationYear!, paymentInformation?.cardExpirationMonth!));

  const handleNewCardSaveBtnClick = useCallback(async () => {
    if (!elements) return;

    setSubmitting(true);

    try {
      if (!paymentInformation || newCard) {
        const tokenResult = await stripe?.createToken(elements!.getElement(CardElement) as StripeCardElement);
        if (tokenResult?.error) {
          setSubmitting(false);
          if (tokenResult.error.message) showError(tokenResult.error.message);
          return;
        }
        const token = tokenResult?.token?.id || '';
        await registerPaymentMethod({ variables: { token } });
      }

      setSubmitting(false);
      setNewCard(false);
      showMessage(`Your card was updated.`);
    } catch (error: any) {
      setSubmitting(false);
      setNewCard(false);
      showError(error.message);
    }
  }, [elements, paymentInformation, newCard, showMessage, showError, stripe, registerPaymentMethod]);

  return (
    <>
      <h2 className="text-headline mb-3">Place Your Bid</h2>
      <hr className="d-none d-md-block" />
      <Row className="mb-0 mb-md-4">
        <Col className="px-0 pe-md-3" md="6">
          <div className="text--body fw-bold">My credit card</div>
        </Col>
        <Col className="px-0 px-md-2 mt-2 mt-md-0" md="6">
          <CardInput
            expired={expired}
            handleAddCard={() => setNewCard(true)}
            isSubmitting={isSubmitting}
            newCard={newCard}
            paymentInformation={paymentInformation}
            showSaveBtn={cardComplete}
            onCancel={() => setNewCard(false)}
            onChange={(event: StripeCardElementChangeEvent) => setCardComplete(event.complete)}
            onSave={handleNewCardSaveBtnClick}
          />
        </Col>
      </Row>
    </>
  );
};

export default PaymentInformation;
