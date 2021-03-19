import { FC, SetStateAction, useState, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import { MakeBid } from 'src/apollo/queries/bids';
import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';

import styles from './styles.module.scss';

interface Props {
  auctionId: string;
  maxBid: Dinero.Dinero;
  setMaxBid: (_: SetStateAction<Dinero.Dinero>) => void;
}

const BidInput: FC<Props> = ({ auctionId, maxBid, setMaxBid }) => {
  const [updateError, setUpdateError] = useState('');
  const { isAuthenticated } = useAuth0();
  const nextMinBid = maxBid.add(Dinero({ amount: 50 }));
  const [makeBid] = useMutation(MakeBid, {
    onCompleted(newBid) {
      setUpdateError('');
      setMaxBid(Dinero(newBid.createAuctionBid.bid));
    },
    onError(error) {
      setUpdateError(error.message);
    },
  });

  const handleSubmit = useCallback(
    (values) => {
      if (!isAuthenticated) {
        window.alert('You need to log in to make a bid!');
        return;
      }
      const newBid = Dinero(values.maxBid);
      const confirmation = window.confirm(`Your max bid is ${newBid.toFormat('$0.00')}. Are you sure?`);

      if (confirmation) {
        makeBid({ variables: { id: auctionId, bid: newBid.toObject() } });
      }
    },
    [auctionId, isAuthenticated, makeBid],
  );

  return (
    <Form initialValues={{ maxBid: nextMinBid.toObject() }} onSubmit={handleSubmit}>
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
      {updateError && <p className={clsx(styles.error, 'text-label mt-0 mb-2')}>{updateError}</p>}
    </Form>
  );
};

export default BidInput;
