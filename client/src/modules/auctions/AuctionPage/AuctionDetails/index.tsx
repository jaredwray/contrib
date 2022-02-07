import { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useContext, useState } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { format as dateFormat, differenceInSeconds } from 'date-fns';
import { format, toDate } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

import { FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import WatchBtn from 'src/components/buttons/WatchBtn';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import WithStripe from 'src/components/wrappers/WithStripe';
import { pluralize } from 'src/helpers/pluralize';
import { toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';
import { Auction, AuctionDeliveryStatus } from 'src/types/Auction';

import { BidConfirmationModal, BidConfirmationRef } from './BidConfirmationModal';
import { BidInput } from './BidInput';
import ShareBtn from './ShareBtn';
import styles from './styles.module.scss';

const FINAL_BID = 999999;

interface Props {
  auction: Auction;
  isDeliveryPage?: boolean;
}

const AuctionDetails: FC<Props> = ({ auction, isDeliveryPage }): ReactElement => {
  const { account } = useContext(UserAccountContext);
  const { isAuthenticated } = useAuth();
  const { showMessage, showError } = useShowNotification();
  const history = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();
  const [isBuying, setIsBuying] = useState(false);
  const [minutesWithoutReload, SetMinutesinterval] = useState(0);
  const [followAuction, { loading: followLoading }] = useMutation(FollowAuctionMutation);
  const [unfollowAuction, { loading: unfollowLoading }] = useMutation(UnfollowAuctionMutation);
  const auctionId = auction.id;

  const {
    followers,
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
    fairMarketValue,
    bidStep,
  } = auction;

  const [followed, setFollowed] = useState(() => followers?.some((follower) => follower.user === account?.mongodbId));
  const [followersNumber, setFollowersNumber] = useState(followers?.length || 0);
  const ended = toDate(endDate) <= new Date();
  const canBid = isActive && !ended && currentPrice.amount !== FINAL_BID * 100 && !isDeliveryPage;
  const isMyAuction = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction.auctionOrganizer.id,
  );

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
  const endDateFormatted = dateFormat(new Date(endDate), 'MMM dd yyyy');
  const price = useMemo(() => (currentPrice && Dinero(currentPrice)) || Dinero(startPrice), [currentPrice, startPrice]);
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

  const handleFollowAuction = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await followAuction({ variables: { auctionId } });
        showMessage('Successfully followed');
        setFollowed(true);
        setFollowersNumber(followersNumber ? followersNumber + 1 : 1);
      } catch (error) {
        showError(error.message);
      }
      return;
    }

    RedirectWithReturnAfterLogin(`/auctions/${auctionId}`);
  }, [
    auctionId,
    showError,
    showMessage,
    followAuction,
    followersNumber,
    isAuthenticated,
    RedirectWithReturnAfterLogin,
  ]);

  const handleUnfollowAuction = useCallback(async () => {
    try {
      await unfollowAuction({ variables: { auctionId } });
      showMessage('Successfully unfollowed');
      setFollowed(false);
      setFollowersNumber(followersNumber - 1);
    } catch (error) {
      showError(error.message);
    }
  }, [auctionId, showError, showMessage, unfollowAuction, followersNumber]);

  return (
    <>
      <div className={clsx(styles.title, 'text-subhead pt-2 break-word')}>{title}</div>
      <div className="text-headline">{price.toFormat('$0,0')}</div>
      {!isSold && (
        <div className="d-flex justify-content-between flex-wrap text-all-cups pt-3 pb-3">
          <span className="pr-4 pr-sm-0">{pluralize(totalBids, 'bid')}</span>
          <span>
            {!ended && (
              <>
                <span className={styles.notBold}>ends in </span>
                {secondsLeft <= 60 ? <span className={styles.secondsLeft}>{`${secondsLeft}s`}</span> : durationTillEnd}
              </>
            )}
            <span className={styles.notBold}>{ended && 'ended'} on </span>
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
      <WithStripe>
        <BidConfirmationModal
          ref={confirmationRef}
          auctionId={auctionId}
          isBuying={isBuying}
          setIsBuying={setIsBuying}
        />
      </WithStripe>
      {canBid && <BidInput fairMarketValue={Dinero(fairMarketValue)} minBid={minBid} onSubmit={handleBid} />}
      {canEdit && (
        <Link className="w-100 btn btn-primary" to={`/auctions/${auction.auctionOrganizer.id}/${auctionId}/title`}>
          Edit
        </Link>
      )}
      {canBid && isShowBuyButton && (
        <Button className="w-100 d-block" title="Buy it now" type="button" variant="primary" onClick={handleBuy}>
          Buy it now for
          <br />
          {buyingPrice}
        </Button>
      )}
      {isActive && !ended && (
        <WatchBtn
          entityType="auction"
          followHandler={handleFollowAuction}
          followed={followed}
          followersNumber={followersNumber}
          loading={followLoading || unfollowLoading}
          unfollowHandler={handleUnfollowAuction}
        />
      )}
      <ShareBtn link={auction.shortLink.shortLink} />
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
