import { FC, ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import clsx from 'clsx';
import { format as dateFormat } from 'date-fns';
import { format, toDate, utcToZonedTime } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { mergeUrlPath } from 'src/helpers/mergeUrlPath';
import { pluralize } from 'src/helpers/pluralize';
import { toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';
import { Auction, AuctionStatus } from 'src/types/Auction';

import { BidConfirmationModal, BidConfirmationRef } from './BidConfirmationModal';
import { BidInput } from './BidInput';
import styles from './styles.module.scss';

interface Props {
  auction: Auction;
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? '');

const AuctionDetails: FC<Props> = ({ auction }): ReactElement => {
  const { addToast } = useToasts();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const history = useHistory();
  const { startPrice, currentPrice, endDate, startDate, totalBids, title, status, timeZone } = auction;
  const ended = toDate(endDate) <= new Date();
  const startTime = format(utcToZonedTime(startDate, timeZone), 'p');
  const endTime = format(utcToZonedTime(startDate, timeZone), 'p');

  const isPending = auction.status === AuctionStatus.PENDING;

  const durationTillEnd = toHumanReadableDuration(endDate);
  const endDateFormatted = dateFormat(toDate(utcToZonedTime(endDate, timeZone)), 'MMM dd yyyy');
  const startFormatted = dateFormat(toDate(utcToZonedTime(startDate, timeZone)), 'MMM dd yyyy');

  const price = useMemo(() => (currentPrice && Dinero(currentPrice)) || Dinero(startPrice), [currentPrice, startPrice]);
  const minBid = useMemo(
    () => (currentPrice && Dinero(currentPrice).add(Dinero({ amount: 100 }))) || Dinero(startPrice),
    [currentPrice, startPrice],
  );
  const canBid = status === AuctionStatus.ACTIVE && !ended;
  const queryParams = useUrlQueryParams();

  const confirmationRef = useRef<BidConfirmationRef>(null);

  const stripeOptions = {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap',
      },
    ],
  };

  const handleBid = useCallback(
    async (amount: Dinero.Dinero) => {
      if (!isAuthenticated) {
        const bidPath = `/auctions/${auction.id}?placeBid=${JSON.stringify(amount.toJSON())}`;
        const redirectUri = mergeUrlPath(
          process.env.REACT_APP_PLATFORM_URL,
          `/after-login?returnUrl=${encodeURIComponent(bidPath)}`,
        );
        loginWithRedirect({ redirectUri }).catch((error) => {
          addToast(error.message, { appearance: 'error', autoDismiss: true });
        });
        return;
      }

      confirmationRef.current?.placeBid(amount);
    },
    [loginWithRedirect, isAuthenticated, addToast, auction],
  );

  const placeBidQueryParam = queryParams.get('placeBid');

  useEffect(() => {
    if (placeBidQueryParam) {
      const amount = Dinero(JSON.parse(placeBidQueryParam));
      if (amount.greaterThanOrEqual(minBid)) {
        handleBid(amount).catch(() => {
          // any error should be handled by handleBid
        });
      }
      history.replace(`/auctions/${auction.id}`);
    }
  }, [placeBidQueryParam, auction.id, minBid, handleBid, history]);

  return (
    <>
      <div className={clsx(styles.title, 'text-subhead pt-2 break-word')}>{title}</div>
      <div className="text-headline">{price.toFormat('$0,0')}</div>
      <div className="d-flex justify-content-between flex-wrap text-all-cups pt-3 pb-3">
        {isPending || (
          <>
            <span className="pr-4 pr-sm-0">{pluralize(totalBids, 'bid')}</span>
            <span>
              {!ended && (
                <>
                  <span className={styles.notBold}>ends in </span>
                  {durationTillEnd}
                </>
              )}
              <span className={styles.notBold}>{ended && 'ended'} on </span>
              {endDateFormatted}
            </span>
          </>
        )}
        {isPending && (
          <>
            <p>
              <span className={styles.notBold}>starts in </span>
              {startTime} {timeZone}
              <p>
                <span className={styles.notBold}> on </span>
                {startFormatted}
              </p>
            </p>
            <p>
              <span className={styles.notBold}>ends in </span>
              {endTime} {timeZone}
              <p>
                <span className={styles.notBold}> on </span>
                {endDateFormatted}
              </p>
            </p>
          </>
        )}
      </div>
      <Elements options={stripeOptions} stripe={stripePromise}>
        <BidConfirmationModal ref={confirmationRef} auctionId={auction.id} />
      </Elements>
      {canBid && (
        <>
          <BidInput fairMarketValue={Dinero(auction.fairMarketValue)} minBid={minBid} onSubmit={handleBid} />
          {/*<WatchBtn auction={auction} />*/}
        </>
      )}
    </>
  );
};

export default AuctionDetails;
