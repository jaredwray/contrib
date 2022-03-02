import { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useContext, useState } from 'react';

import clsx from 'clsx';
import { format as dateFormat, differenceInSeconds } from 'date-fns';
import { format, toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Button, Row, Col } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

import AuctionItemsFMV from 'src/components/customComponents/AuctionItems';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import WithStripe from 'src/components/wrappers/WithStripe';
import { toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';
import { Auction, AuctionDeliveryStatus } from 'src/types/Auction';

import { BidConfirmationModal, BidConfirmationRef } from './BidConfirmationModal';
import { BidInput } from './BidInput';
import styles from './styles.module.scss';

const FINAL_BID = 999999;

interface Props {
  auction: Auction;
  isDeliveryPage?: boolean;
}

const AuctionDetails: FC<Props> = ({ auction, isDeliveryPage }): ReactElement => {
  const { account } = useContext(UserAccountContext);
  const { isAuthenticated } = useAuth();
  const { showError } = useShowNotification();
  const history = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();
  const [isBuying, setIsBuying] = useState(false);
  const [minutesWithoutReload, SetMinutesinterval] = useState(0);
  const auctionId = auction.id;

  const {
    startPrice,
    itemPrice,
    currentPrice,
    endDate,
    title,
    isSold,
    isStopped,
    isSettled,
    stoppedAt,
    isActive,
    totalBids,
    status,
    items,
    bidStep,
  } = auction;

  const ended = toDate(endDate) <= new Date();
  const canBid = isActive && !ended && currentPrice.amount !== FINAL_BID * 100 && !isDeliveryPage;
  const isMyAuction = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction.auctionOrganizer.id,
  );
  const fairMarketValue = Dinero(auction.fairMarketValue);
  const hasFairMarketValue = fairMarketValue && fairMarketValue.getAmount() > 0;

  const withDeliveryInfoLink = (isMyAuction || account?.isAdmin) && (isSold || isSettled);
  const isWinner = auction.winner?.mongodbId === account?.mongodbId;
  const withLinkToDelivery =
    (isSold || isSettled) && isWinner && (process.env.REACT_APP_UPS_SHOW_LINK_ON_THE_AUCTION_PAGE ?? 'true') === 'true';
  let callAfterMs = 60000;
  const secondsLeft = differenceInSeconds(toDate(endDate), new Date());

  if (secondsLeft <= 120) callAfterMs = 1000;

  useEffect(() => {
    if (!canBid) return;
    const timer = setInterval(() => {
      SetMinutesinterval((minutesWithoutReload) => minutesWithoutReload + 1);
    }, callAfterMs);
    return () => clearInterval(timer);
  }, [canBid, minutesWithoutReload, secondsLeft, callAfterMs]);

  const canEdit = isStopped && (account?.isAdmin || isMyAuction);

  let soldTime = '';
  let stoppedTime = '';
  let isShowBuyButton;

  if (isSold && stoppedAt) soldTime = format(new Date(stoppedAt), 'MMM dd yyyy p');
  if (isStopped && stoppedAt) stoppedTime = format(new Date(stoppedAt), 'MMM dd yyyy');

  const durationTillEnd = toHumanReadableDuration(endDate);
  const endDateFormatted = dateFormat(new Date(endDate), 'EEEE, dd, hh:mma');
  const isFinalBid = currentPrice.amount / 100 > FINAL_BID - 10;
  const isPaid =
    auction.delivery.status === AuctionDeliveryStatus.DELIVERY_PAID ||
    auction.delivery.status === AuctionDeliveryStatus.DELIVERY_PAYMENT_FAILED;

  const minBid = useMemo(
    () =>
      (currentPrice &&
        (!isFinalBid
          ? Dinero(currentPrice).add(Dinero(bidStep))
          : Dinero({ amount: FINAL_BID * 100, currency: currentPrice.currency }))) ||
      Dinero(startPrice),
    [currentPrice, startPrice, isFinalBid, bidStep],
  );

  const placeBidQueryParam = useUrlQueryParams().get('placeBid');
  const confirmationRef = useRef<BidConfirmationRef>(null);
  const buyingPrice = Dinero(itemPrice)?.toFormat('$0,0');

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
    <>
      <div className={clsx(styles.title, 'text-subhead pt-2 break-word')}>{title}</div>
      {!isSold && (
        <div className="d-flex justify-content-between flex-wrap pt-3 pb-3">
          <span>
            {!ended && (
              <>
                <span>Ends in </span>
                {secondsLeft <= 60 ? <span className={styles.secondsLeft}>{`${secondsLeft}s`}</span> : durationTillEnd}
              </>
            )}
            <span>{ended && 'ended'} on </span>
            {endDateFormatted}
          </span>
        </div>
      )}
      {isStopped && (
        <div className="d-flex justify-content-between flex-wrap text-all-cups pt-3 pb-3">
          {status} on {stoppedTime}
        </div>
      )}
      {isSold && (
        <div className="d-flex justify-content-between flex-wrap text-all-cups pt-3 pb-3">
          <span className={styles.notBold}>sold on </span>
          {soldTime}
        </div>
      )}
      <>
        <Row>
          <Col>
            Current Bid:
            <div>View all bids ({totalBids})</div>
          </Col>
          <Col>{Dinero(currentPrice).toFormat('$0,0')}</Col>
        </Row>

        {hasFairMarketValue && (
          <Row>
            <Col>
              Fair market value:
              <div>How is this calculated?</div>
            </Col>
            <Col>{fairMarketValue.toFormat('$0,0')}</Col>
          </Row>
        )}

        {items.length > 0 && <AuctionItemsFMV items={items} />}
      </>
      <WithStripe>
        <BidConfirmationModal
          ref={confirmationRef}
          auctionId={auctionId}
          isBuying={isBuying}
          setIsBuying={setIsBuying}
        />
      </WithStripe>
      {canBid && <BidInput items={items} minBid={minBid} onSubmit={handleBid} />}
      {canEdit && (
        <Link className="w-100 btn btn-primary" to={`/auctions/${auction.auctionOrganizer.id}/${auctionId}/title`}>
          Edit
        </Link>
      )}
      {canBid && isShowBuyButton && (
        <Row>
          <Col>Buy it now for {buyingPrice}</Col>
          <Col>
            <Button className="w-100 d-block" title="Buy it now" type="button" variant="primary" onClick={handleBuy}>
              Buy it now
            </Button>
          </Col>
        </Row>
      )}
      {withLinkToDelivery && (
        <Link className="d-block mt-4" to={`/auctions/${auctionId}/delivery/${isPaid ? 'status' : 'address'}`}>
          {isPaid ? 'Delivery status' : 'Pay for delivery'}
        </Link>
      )}
      {!isDeliveryPage && withDeliveryInfoLink && (
        <Link className="d-block mt-4" to={`/auctions/${auctionId}/delivery/info`}>
          Delivery info page
        </Link>
      )}
    </>
  );
};

export default AuctionDetails;
