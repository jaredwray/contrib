import { FC, useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import InformationLink from 'src/components/customComponents/InformationLink';
import Form from 'src/components/forms/Form/Form';
import MoneyField from 'src/components/forms/inputs/MoneyField';
import { AuctionItem } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  items: AuctionItem[];
  minBid: Dinero.Dinero;
  onSubmit: (amount: Dinero.Dinero) => Promise<any>;
}
const MAX_BID_VALUE = 999999;

export const BidInput: FC<Props> = ({ items, minBid, onSubmit }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialFormValues = useMemo(() => ({ bid: minBid.toObject() }), [minBid.getAmount()]);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = useCallback(
    ({ bid }) => {
      return onSubmit(Dinero(bid));
    },
    [onSubmit],
  );
  const isMaxBidCharged = minBid.getAmount() / 100 > MAX_BID_VALUE;
  const isFinalBid = minBid.getAmount() / 100 === MAX_BID_VALUE;
  const minBidFormatted = minBid.toFormat('$0,0');

  if (isMaxBidCharged) return null;

  return (
    <Form className={clsx(styles.form, 'p-4')} initialValues={initialFormValues} onSubmit={handleSubmit}>
      <p className="text--body">
        Enter your bid amount of {minBidFormatted}
        {!isFinalBid && <span> or more</span>}
        <InformationLink content="secret" text="Learn more about bidding" />
      </p>
      <MoneyField
        required
        className={styles.input}
        minValue={minBid.getAmount() / 100}
        name="bid"
        setDisabled={setDisabled}
      />
      <Button
        className={clsx(styles.button, 'w-100 text-all-cups mt-3')}
        disabled={disabled}
        title="Place your bid"
        type="submit"
      >
        Place bid
      </Button>
    </Form>
  );
};
