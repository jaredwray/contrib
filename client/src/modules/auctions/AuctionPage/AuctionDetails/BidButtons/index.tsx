import { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Button, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import InformationLink from 'src/components/customComponents/InformationLink';
import WithStripe from 'src/components/wrappers/WithStripe';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';
import { Auction } from 'src/types/Auction';

import { BidConfirmationModal, BidConfirmationRef } from './BidConfirmationModal';
import { BidInput } from './BidInput';
import styles from './styles.module.scss';

const FINAL_BID = 999999;

interface Props {
  auction: Auction;
  ended: boolean;
}

const BidButtons: FC<Props> = ({ auction, ended }): ReactElement => {
  const { isAuthenticated } = useAuth();
  const { showError } = useShowNotification();
  const history = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();
  const [isBuying, setIsBuying] = useState(false);
  const auctionId = auction.id;

  const { startPrice, itemPrice, currentPrice, items, bidStep, totalBids } = auction;

  let isShowBuyButton;

  const isFinalBid = currentPrice.amount / 100 > FINAL_BID - 10;

  const placeBidQueryParam = useUrlQueryParams().get('placeBid');
  const confirmationRef = useRef<BidConfirmationRef>(null);
  const buyingPrice = Dinero(itemPrice)?.toFormat('$0,0');
  const minBid = useMemo(() => {
    if (totalBids === 0) return Dinero(startPrice);
    if (isFinalBid) return Dinero({ amount: FINAL_BID * 100, currency: currentPrice.currency });

    return Dinero(currentPrice).add(Dinero(bidStep));
  }, [currentPrice, startPrice, isFinalBid, bidStep, totalBids]);

  if (itemPrice) isShowBuyButton = itemPrice?.amount > minBid.getAmount();

  const commonBidHandler = useCallback(
    (amount: Dinero.Dinero, isBuying?: boolean) => {
      const configuration: { amount: number; currency: Dinero.Currency; isBuying?: boolean } = { ...amount.toJSON() };

      if (isBuying) configuration.isBuying = true;

      const placeBid = JSON.stringify(configuration);

      if (isAuthenticated) {
        confirmationRef.current?.placeBid(amount);
        return;
      }

      RedirectWithReturnAfterLogin(`/auctions/${auctionId}?placeBid=${placeBid}`);
    },
    [isAuthenticated, auctionId, RedirectWithReturnAfterLogin],
  );

  const handleBid = useCallback(async (amount: Dinero.Dinero) => commonBidHandler(amount), [commonBidHandler]);
  const handleBuy = useCallback(async () => {
    setIsBuying(true);
    commonBidHandler(Dinero(itemPrice), true);
  }, [itemPrice, commonBidHandler]);

  useEffect(() => {
    if (!placeBidQueryParam) return;

    const configuration = JSON.parse(placeBidQueryParam);

    if (configuration?.isBuying) setIsBuying(true);

    const { amount, currency } = configuration;
    const value = Dinero({ amount, currency });

    if (value.greaterThanOrEqual(minBid)) {
      handleBid(value).catch((error) => {
        showError(error.message);
      });
    }
    history.replace(`/auctions/${auctionId}`);
  }, [placeBidQueryParam, auctionId, minBid, handleBid, history, showError]);

  return (
    <div className="pt-3">
      <WithStripe>
        <BidConfirmationModal
          ref={confirmationRef}
          auctionId={auctionId}
          isBuying={isBuying}
          setIsBuying={setIsBuying}
        />
      </WithStripe>
      <BidInput items={items} minBid={minBid} onSubmit={handleBid} />
      {isShowBuyButton && (
        <div className={clsx(styles.buyItNowWrapper, 'mt-3')}>
          <Row className="p-4">
            <Col className="text-label-new p-0">
              Buy it now for {buyingPrice}
              <InformationLink
                content="This value is carefully selected by the auction owner"
                text="How is this calculated?"
              />
            </Col>
            <Col className="p-0" lg="6" md="12">
              <Button
                className={clsx(styles.buyItNowBtn, 'w-100 d-block mt-md-0 mt-3')}
                title="Buy it now"
                type="button"
                variant="light"
                onClick={handleBuy}
              >
                Buy It Now
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default BidButtons;
