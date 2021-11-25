import { FC } from 'react';

import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';

import { PaymentInformation } from 'src/components/helpers/UserAccountProvider/PaymentInformation';

import CardInfo from './CardInfo';
import StripeInput from './StripeInput';
import styles from './styles.module.scss';

interface Props {
  cardInfoStyles?: string;
  cancelButtonStyles?: string;
  stripeInputStyles?: string;
  expired: boolean;
  newCard: boolean;
  showSaveBtn?: boolean | undefined;
  isSubmitting: boolean;
  paymentInformation: PaymentInformation | null | undefined;
  handleAddCard: () => void;
  onChange?(event: StripeCardElementChangeEvent): void;
  onCancel: () => void;
  onSave?: (() => void) | undefined;
}
export const CardInput: FC<Props> = ({
  expired,
  paymentInformation,
  cardInfoStyles,
  cancelButtonStyles,
  stripeInputStyles,
  isSubmitting,
  newCard,
  showSaveBtn,
  handleAddCard,
  onChange,
  onCancel,
  onSave,
}) => {
  return (
    <div className={styles.info}>
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
          showSaveBtn={showSaveBtn}
          onCancel={onCancel}
          onChange={onChange}
          onSave={onSave}
        />
      )}
    </div>
  );
};
