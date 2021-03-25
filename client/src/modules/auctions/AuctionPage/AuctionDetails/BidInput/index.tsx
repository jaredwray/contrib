import { FC, useCallback, useMemo } from 'react';

import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';

import styles from './styles.module.scss';

interface Props {
  minBid: Dinero.Dinero;
  onSubmit: (amount: Dinero.Dinero) => Promise<any>;
}

export const BidInput: FC<Props> = ({ minBid, onSubmit }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialFormValues = useMemo(() => ({ bid: minBid.toObject() }), [minBid.getAmount()]);

  const handleSubmit = useCallback(
    ({ bid }) => {
      return onSubmit(Dinero(bid));
    },
    [onSubmit],
  );

  return (
    <Form initialValues={initialFormValues} onSubmit={handleSubmit}>
      <MoneyField
        required
        externalText={
          <span className={clsx(styles.notBold, 'text-label text-all-cups')}>
            enter <span className={styles.bold}>{minBid.toFormat('$0,0')}</span> or more
          </span>
        }
        name="bid"
        title="Enter your max bid amount"
      />
      <Button className="w-100" title="Place your bid" type="submit" variant="dark">
        Place your bid
      </Button>
      <p className="text-label pt-2 mb-2">Bidding is a commitment to buy this item if you win the auction.</p>
    </Form>
  );
};
