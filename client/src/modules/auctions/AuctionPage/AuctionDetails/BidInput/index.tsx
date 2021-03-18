import { FC } from 'react';

import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';

import styles from './styles.module.scss';

interface Props {
  maxBid: Dinero.Dinero;
}

const BidInput: FC<Props> = ({ maxBid }) => {
  const nextMinBid = maxBid.add(Dinero({ amount: 50 }));

  return (
    <Form initialValues={{ maxBid }} onSubmit={() => {}}>
      <MoneyField
        required
        externalText={
          <span className={clsx(styles.notBold, 'text-label text-all-cups')}>
            enter <span className={styles.bold}>{nextMinBid.toFormat('$0.00')}</span> or more
          </span>
        }
        name="maxBid"
        title="Enter your max bid amount"
      />
      <Button className="w-100" variant="dark">
        Place your bid
      </Button>
      <p className="text-label pt-2">Bidding is a commitment to buy this item if you win the auction.</p>
    </Form>
  );
};

export default BidInput;
