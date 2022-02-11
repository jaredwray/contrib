import { FC, useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import AuctionItemsFMV from 'src/components/customComponents/AuctionItems';
import Form from 'src/components/forms/Form/Form';
import MoneyField from 'src/components/forms/inputs/MoneyField';
import { AuctionItem } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  minBid: Dinero.Dinero;
  onSubmit: (amount: Dinero.Dinero) => Promise<any>;
  fairMarketValue: Dinero.Dinero;
  items: AuctionItem[];
}
const MaxBidValue = 999999;

export const BidInput: FC<Props> = ({ minBid, fairMarketValue, items, onSubmit }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialFormValues = useMemo(() => ({ bid: minBid.toObject() }), [minBid.getAmount()]);
  const [disabled, setDisabled] = useState(false);

  const hasFairMarketValue = fairMarketValue && fairMarketValue.getAmount() > 0;
  const hasAuctionItemsFMV = items.length > 0;

  const handleSubmit = useCallback(
    ({ bid }) => {
      return onSubmit(Dinero(bid));
    },
    [onSubmit],
  );
  const isMaxBidCharged = minBid.getAmount() / 100 > MaxBidValue;
  const isFinalBid = minBid.getAmount() / 100 === MaxBidValue;

  return (
    <Form initialValues={initialFormValues} onSubmit={handleSubmit}>
      {!isMaxBidCharged && (
        <MoneyField
          required
          externalText={
            <span className={clsx(styles.notBold, 'text-label text-all-cups')}>
              enter <span className={styles.bold}>{minBid.toFormat('$0,0')}</span> {!isFinalBid && <span>or more</span>}
            </span>
          }
          minValue={minBid.getAmount() / 100}
          name="bid"
          setDisabled={setDisabled}
          title="Enter your max bid amount"
        />
      )}
      {hasFairMarketValue && <p>Fair market value: {fairMarketValue.toFormat('$0,0')}</p>}
      {hasAuctionItemsFMV && <AuctionItemsFMV items={items} />}
      {!isMaxBidCharged && (
        <>
          <Button className="w-100" disabled={disabled} title="Place your bid" type="submit" variant="dark">
            Place your bid
          </Button>
          <p className="text-label pt-2 mb-2">Bidding is a commitment to buy this item if you win the auction.</p>{' '}
        </>
      )}
    </Form>
  );
};
