import { FC } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import { PaymentInformation } from 'src/components/UserAccountProvider/PaymentInformation';

import styles from './styles.module.scss';

export interface BidConfirmationRef {
  placeBid: (amount: Dinero.Dinero) => void;
}

interface Props {
  expired: boolean;
  isSubmitting: boolean;
  paymentInfo: PaymentInformation | null | undefined;
  onNewCardAdd: () => void;
  className?: string;
}

const CardInfo: FC<Props> = ({ expired, className, isSubmitting, paymentInfo, onNewCardAdd }) => {
  if (!paymentInfo) {
    return null;
  }

  return (
    <div className={clsx(className || styles.cardInfo, expired && styles.expired, 'flex-wrap')}>
      <div className="flex-column text-center">
        {paymentInfo.cardBrand} **** **** **** {paymentInfo.cardNumberLast4}, {paymentInfo.cardExpirationMonth}/
        {`${paymentInfo.cardExpirationYear}`.slice(-2)}
        {expired && <span className="text-all-cups font-weight-bold">expired</span>}
      </div>

      <Button
        className={clsx(styles.addCardBtn, 'text--body flex-column')}
        disabled={isSubmitting}
        size="sm"
        variant="link"
        onClick={onNewCardAdd}
      >
        Use another card
      </Button>
    </div>
  );
};

export default CardInfo;
