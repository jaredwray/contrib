import { FC, ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import clsx from 'clsx';
import { format as dateFormat } from 'date-fns';
import { toDate } from 'date-fns-tz';
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

  const { startPrice, maxBid, endDate, totalBids, title, status } = auction;
  const ended = toDate(endDate) <= new Date();
  const durationTillEnd = toHumanReadableDuration(endDate);
  const endDateFormatted = dateFormat(toDate(endDate), 'MMM dd yyyy');

  const price = useMemo(() => (maxBid && Dinero(maxBid.bid)) || Dinero(startPrice), [maxBid, startPrice]);
  const minBid = useMemo(() => (maxBid && Dinero(maxBid.bid).add(Dinero({ amount: 50 }))) || Dinero(startPrice), [
    maxBid,
    startPrice,
  ]);
  const canBid = status === AuctionStatus.ACTIVE && !ended;
  const queryParams = useUrlQueryParams();

  const confirmationRef = useRef<BidConfirmationRef>(null);

  const handleBid = useCallback(
    async (amount: Dinero.Dinero) => {
      if (!isAuthenticated) {
        const bidPath = `/auction/${auction.id}?placeBid=${JSON.stringify(amount.toJSON())}`;
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
      history.replace(`/auction/${auction.id}`);
    }
  }, [placeBidQueryParam, auction.id, minBid, handleBid, history]);

  return (
    <>
      <div className={clsx(styles.title, 'text-subhead pt-2 break-word')}>{title}</div>
      <div className="text-headline">{price.toFormat('$0,0.00')}</div>
      <div className="text-label text-all-cups pt-3 pb-3">
        {pluralize(totalBids, 'bid')}{' '}
        <span className="float-right">
          {!ended && (
            <>
              <span className={styles.notBold}>ends in</span> {durationTillEnd}{' '}
            </>
          )}
          <span className={styles.notBold}>{ended && 'ended'} on</span> {endDateFormatted}
        </span>
      </div>
      <Elements stripe={stripePromise}>
        <BidConfirmationModal ref={confirmationRef} auctionId={auction.id} />
      </Elements>
      {canBid && (
        <>
          <BidInput minBid={minBid} onSubmit={handleBid} />
          {/*<WatchBtn auction={auction} />*/}
        </>
      )}
    </>
  );
};

export default AuctionDetails;
