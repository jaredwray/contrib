import { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useContext, useState } from 'react';

import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import clsx from 'clsx';
import { format as dateFormat, differenceInSeconds } from 'date-fns';
import { format, toDate, utcToZonedTime } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';
import { useHistory, useParams, Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import WatchBtn from 'src/components/WatchBtn';
import { pluralize } from 'src/helpers/pluralize';
import { toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';
import { utcTimeZones } from 'src/modules/auctions/editAuction/DetailsPage/consts';
import { Auction, AuctionDeliveryStatus } from 'src/types/Auction';

import { BidConfirmationModal, BidConfirmationRef } from './BidConfirmationModal';
import { BidInput } from './BidInput';
import styles from './styles.module.scss';

const BIDS_STEP_CENTS = 1000;

interface Props {
  auction: Auction;
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? '');

const AuctionDetails: FC<Props> = ({ auction }): ReactElement => {
  const [isBying, setIsBying] = useState(false);
  const [minutesWithoutReload, SetMinutesinterval] = useState(0);
  const { account } = useContext(UserAccountContext);
  const { addToast } = useToasts();
  const { isAuthenticated } = useAuth0();
  const history = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();
  const { auctionId } = useParams<{ auctionId: string }>();

  const [followAuction, { loading: followLoading }] = useMutation(FollowAuctionMutation);
  const [unfollowAuction, { loading: unfollowLoading }] = useMutation(UnfollowAuctionMutation);

  const {
    followers,
    startPrice,
    itemPrice,
    currentPrice,
    endDate,
    startDate,
    title,
    isPending,
    isSold,
    isStopped,
    isSettled,
    stoppedAt,
    isActive,
    totalBids,
    status,
    fairMarketValue,
  } = auction;

  const [followed, setFollowed] = useState(() => followers?.some((follower) => follower.user === account?.mongodbId));
  const [followersNumber, setFollowersNumber] = useState(followers?.length || 0);

  const ended = toDate(endDate) <= new Date();
  const timeZone = utcTimeZones.find((timeZone) => timeZone.label === auction.timeZone)?.value;
  const startTime = format(utcToZonedTime(startDate, timeZone || ''), 'p');
  const endTime = format(utcToZonedTime(endDate, timeZone || ''), 'p');
  const canBid = isActive && !ended;
  const isMyAuction = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction.auctionOrganizer.id,
  );
  const isWinner = auction.winner?.mongodbId === account?.mongodbId;
  let callAfterMs = 60000;
  const secondsLeft = differenceInSeconds(toDate(endDate), new Date());
  if (secondsLeft <= 120) {
    callAfterMs = 1000;
  }

  useEffect(() => {
    if (!canBid) return;
    const timer = setInterval(() => {
      SetMinutesinterval((minutesWithoutReload) => minutesWithoutReload + 1);
    }, callAfterMs);
    return () => clearInterval(timer);
  }, [canBid, minutesWithoutReload, secondsLeft, callAfterMs]);

  const canEdit = (isPending || isStopped) && (account?.isAdmin || isMyAuction);

  let soldTime = '';
  let stoppedTime = '';

  if (isSold && stoppedAt) {
    soldTime = format(utcToZonedTime(stoppedAt, timeZone || ''), 'MMM dd yyyy p');
  }
  if (isStopped && stoppedAt) {
    stoppedTime = format(utcToZonedTime(stoppedAt, timeZone || ''), 'MMM dd yyyy');
  }

  const durationTillEnd = toHumanReadableDuration(endDate);
  const endDateFormatted = dateFormat(toDate(utcToZonedTime(endDate, timeZone || '')), 'MMM dd yyyy');
  const startFormatted = dateFormat(toDate(utcToZonedTime(startDate, timeZone || '')), 'MMM dd yyyy');

  const price = useMemo(() => (currentPrice && Dinero(currentPrice)) || Dinero(startPrice), [currentPrice, startPrice]);
  const minBid = useMemo(
    () => (currentPrice && Dinero(currentPrice).add(Dinero({ amount: BIDS_STEP_CENTS }))) || Dinero(startPrice),
    [currentPrice, startPrice],
  );
  const placeBidQueryParam = useUrlQueryParams().get('placeBid');
  const isBuyingParam = useUrlQueryParams().get('isBuying');
  const confirmationRef = useRef<BidConfirmationRef>(null);

  const buyingPrice = Dinero(itemPrice)?.toFormat('$0,0');

  let isShowBuyButton;

  if (itemPrice) {
    isShowBuyButton = itemPrice?.amount >= minBid.getAmount();
  }

  const stripeOptions = {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap',
      },
    ],
  };

  const commonBidHandler = useCallback(
    (amount: Dinero.Dinero, isBuying?: boolean) => {
      const placeBid = JSON.stringify(amount.toJSON());

      if (isAuthenticated) {
        confirmationRef.current?.placeBid(amount);
        return;
      }

      RedirectWithReturnAfterLogin(`/auctions/${auctionId}?placeBid=${placeBid}${isBuying ? '&isBuying=true' : ''}`);
    },
    [isAuthenticated, auctionId, RedirectWithReturnAfterLogin],
  );
  const handleBid = useCallback(async (amount: Dinero.Dinero) => commonBidHandler(amount), [commonBidHandler]);
  const handleBuy = useCallback(async () => {
    setIsBying(true);
    commonBidHandler(Dinero(itemPrice), true);
  }, [itemPrice, commonBidHandler]);

  useEffect(() => {
    if (!placeBidQueryParam) {
      return;
    }
    if (isBuyingParam) {
      setIsBying(true);
    }

    const amount = Dinero(JSON.parse(placeBidQueryParam));
    if (amount.greaterThanOrEqual(minBid)) {
      handleBid(amount).catch(() => {
        // any error should be handled by handleBid
      });
    }
    history.replace(`/auctions/${auctionId}`);
  }, [placeBidQueryParam, auctionId, minBid, handleBid, history, isBuyingParam]);

  const handleFollowAuction = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await followAuction({ variables: { auctionId } });
        addToast('Successfully followed', { autoDismiss: true, appearance: 'success' });
        setFollowed(true);
        setFollowersNumber(followersNumber ? followersNumber + 1 : 1);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'warning' });
      }
      return;
    }

    RedirectWithReturnAfterLogin(`/auctions/${auctionId}`);
  }, [auctionId, addToast, followAuction, followersNumber, isAuthenticated, RedirectWithReturnAfterLogin]);

  const handleUnfollowAuction = useCallback(async () => {
    try {
      await unfollowAuction({ variables: { auctionId } });
      addToast('Successfully unfollowed', { autoDismiss: true, appearance: 'success' });
      setFollowed(false);
      setFollowersNumber(followersNumber - 1);
    } catch (error) {
      addToast(error.message, { autoDismiss: true, appearance: 'warning' });
    }
  }, [auctionId, addToast, unfollowAuction, followersNumber]);

  const isPaid = auction.delivery.status === AuctionDeliveryStatus.PAID;
  return (
    <>
      <div className={clsx(styles.title, 'text-subhead pt-2 break-word')}>{title}</div>
      <div className="text-headline">{price.toFormat('$0,0')}</div>
      {isPending && (
        <>
          <div className="justify-content-between flex-wrap text-all-cups pt-3">
            <div>
              <span className={styles.notBold}>starts in </span>
              {startTime} {auction.timeZone}
              <p>
                <span className={styles.notBold}> on </span>
                {startFormatted}
              </p>
            </div>
          </div>
          <div className="justify-content-between flex-wrap text-all-cups pb-3">
            <div>
              <span className={styles.notBold}>ends in </span>
              {endTime} {auction.timeZone}
              <p>
                <span className={styles.notBold}> on </span>
                {endDateFormatted}
              </p>
            </div>
          </div>
        </>
      )}
      {!isPending && !isSold && (
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
          {soldTime} {auction.timeZone}
        </div>
      )}
      <Elements options={stripeOptions} stripe={stripePromise}>
        <BidConfirmationModal ref={confirmationRef} auctionId={auctionId} isBuying={isBying} setIsBying={setIsBying} />
      </Elements>
      {canBid && <BidInput fairMarketValue={Dinero(fairMarketValue)} minBid={minBid} onSubmit={handleBid} />}
      {canEdit && (
        <Link className="w-100 btn btn-primary" to={`/auctions/${auctionId}/basic`}>
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
      <WatchBtn
        entityType="auction"
        followHandler={handleFollowAuction}
        followed={followed}
        followersNumber={followersNumber}
        loading={followLoading || unfollowLoading}
        unfollowHandler={handleUnfollowAuction}
      />
      {(isSold || isSettled) && isWinner && (
        <Link className="d-inline-block mt-5" to={`/auctions/${auctionId}/delivery/${isPaid ? 'status' : 'address'}`}>
          {isPaid ? 'Delivery status' : 'Pay for delivery'}
        </Link>
      )}
    </>
  );
};

export default AuctionDetails;
