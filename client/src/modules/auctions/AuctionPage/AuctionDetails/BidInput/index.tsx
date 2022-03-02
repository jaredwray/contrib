import { FC, useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import Form from 'src/components/forms/Form/Form';
import MoneyField from 'src/components/forms/inputs/MoneyField';
import { AuctionItem } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  minBid: Dinero.Dinero;
  onSubmit: (amount: Dinero.Dinero) => Promise<any>;
  items: AuctionItem[];
}
const MaxBidValue = 999999;

export const BidInput: FC<Props> = ({ minBid, items, onSubmit }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialFormValues = useMemo(() => ({ bid: minBid.toObject() }), [minBid.getAmount()]);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = useCallback(
    ({ bid }) => {
      return onSubmit(Dinero(bid));
    },
    [onSubmit],
  );
  const isMaxBidCharged = minBid.getAmount() / 100 > MaxBidValue;
  const isFinalBid = minBid.getAmount() / 100 === MaxBidValue;
  const minBidFormatted = minBid.toFormat('$0,0');

  return (
    <Form initialValues={initialFormValues} onSubmit={handleSubmit}>
      {!isMaxBidCharged && (
        <MoneyField
          required
          externalText={
            <>
              <span className={clsx(styles.notBold, 'text-label')}>
                Enter your bid amount of {minBidFormatted}
                {!isFinalBid && <span> or more</span>}
              </span>
              <div>Learn more about bidding</div>
            </>
          }
          minValue={minBid.getAmount() / 100}
          name="bid"
          setDisabled={setDisabled}
        />
      )}
      {!isMaxBidCharged && (
        <Button className="w-100 text-all-cups" disabled={disabled} title="Place your bid" type="submit" variant="dark">
          Place bid
        </Button>
      )}
    </Form>
  );
};
