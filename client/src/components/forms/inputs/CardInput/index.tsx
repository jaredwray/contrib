import { FC } from 'react';

import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';

import { PaymentInformation } from 'src/components/helpers/UserAccountProvider/PaymentInformation';

import CardInfo from './CardInfo';
import StripeInput from './StripeInput';

interface Props {
  cardInfoStyles?: string;
  cancelButtonStyles?: string;
  stripeInputStyles?: string;
  expired: boolean;
  newCard: boolean;
  isSubmitting: boolean;
  paymentInformation: PaymentInformation | null | undefined;
  handleAddCard: () => void;
  onChange?(event: StripeCardElementChangeEvent): void;
  onCancel: () => void;
}
export const CardInput: FC<Props> = ({
  expired,
  paymentInformation,
  cardInfoStyles,
  cancelButtonStyles,
  stripeInputStyles,
  isSubmitting,
  newCard,
  handleAddCard,
  onChange,
  onCancel,
}) => {
  return (
    <>
      {(expired || paymentInformation) && !newCard && (
        <CardInfo
          className={cardInfoStyles}
          expired={expired}
          isSubmitting={isSubmitting}
          paymentInfo={paymentInformation}
          onNewCardAdd={handleAddCard}
        />
      )}
      {(!paymentInformation || newCard) && (
        <StripeInput
          cancelButtonClassName={cancelButtonStyles}
          disabled={isSubmitting}
          inputClassName={stripeInputStyles}
          showCancelBtn={Boolean(paymentInformation)}
          onCancel={onCancel}
          onChange={onChange}
        />
      )}
    </>
  );
};
