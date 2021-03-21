import { FC, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

import { MakeBid } from 'src/apollo/queries/bids';
import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';

import styles from './styles.module.scss';

interface Props {
  auctionId: string;
  maxBid: Dinero.Dinero;
}

const BidInput: FC<Props> = ({ auctionId, maxBid }) => {
  const { addToast } = useToasts();
  const { isAuthenticated } = useAuth0();
  const nextMinBid = maxBid.add(Dinero({ amount: 50 }));
  const [makeBid] = useMutation(MakeBid);

  const handleSubmit = useCallback(
    async (values) => {
      const newBid = Dinero(values.maxBid);
      const confirmation = window.confirm(`Your max bid is ${newBid.toFormat('$0,0.00')}. Are you sure?`);

      if (confirmation) {
        try {
          await makeBid({ variables: { id: auctionId, bid: newBid.toObject() } });
        } catch (error) {
          addToast(error.message, { appearance: 'error', autoDismiss: true });
        }
      }
    },
    [auctionId, makeBid, addToast],
  );

  return (
    <Form initialValues={{ maxBid: nextMinBid.toObject() }} onSubmit={handleSubmit}>
      <MoneyField
        required
        externalText={
          <span className={clsx(styles.notBold, 'text-label text-all-cups')}>
            enter <span className={styles.bold}>{nextMinBid.toFormat('$0,0.00')}</span> or more
          </span>
        }
        name="maxBid"
        title="Enter your max bid amount"
      />
      <Button
        className="w-100"
        disabled={!isAuthenticated}
        title={isAuthenticated ? 'Place your bid' : 'log in to make a bid!'}
        type="submit"
        variant="dark"
      >
        Place your bid
      </Button>
      <p className="text-label pt-2 mb-2">Bidding is a commitment to buy this item if you win the auction.</p>
    </Form>
  );
};

export default BidInput;
