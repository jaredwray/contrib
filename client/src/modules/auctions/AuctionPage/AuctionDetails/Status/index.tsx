import { FC, ReactElement, useEffect, useState } from 'react';

import { differenceInSeconds } from 'date-fns';
import { toDate } from 'date-fns-tz';

import { toHumanReadableDuration, toFormatedDate } from 'src/helpers/timeFormatters';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auction: Auction;
  canBid: boolean;
  ended: boolean;
}

const Status: FC<Props> = ({ auction, canBid, ended }): ReactElement => {
  const [minutesWithoutReload, SetMinutesWithoutReload] = useState(0);
  const { endsAt, isSold, isStopped, isSettled, stoppedAt, status } = auction;
  const durationTillEnd = toHumanReadableDuration(endsAt);
  const endsAtFormatted = toFormatedDate(endsAt, 'EEEE, dd, hh:mma');
  const secondsLeft = differenceInSeconds(toDate(endsAt), new Date());

  let callAfterMs = 60000;
  let soldTime = '';
  let stoppedTime = '';

  if (secondsLeft <= 120) callAfterMs = 1000;
  if (isSold && stoppedAt) soldTime = toFormatedDate(stoppedAt, 'MMM dd yyyy p');
  if (isStopped && stoppedAt) stoppedTime = toFormatedDate(stoppedAt, 'MMM dd yyyy');

  useEffect(() => {
    if (!canBid) return;
    const timer = setInterval(() => {
      if (!isSold && !isSettled && toDate(endsAt) <= new Date()) window.location.reload();
      SetMinutesWithoutReload((minutesWithoutReload) => minutesWithoutReload + 1);
    }, callAfterMs);
    return () => clearInterval(timer);
  }, [canBid, minutesWithoutReload, callAfterMs, isSold, isSettled, endsAt]);

  return (
    <div className="text-body-new pt-2 pb-2">
      {!isSold && (
        <span>
          {!ended && (
            <>
              <span>Ends in </span>
              {secondsLeft <= 60 ? <span className={styles.secondsLeft}>{`${secondsLeft}s`}</span> : durationTillEnd}
            </>
          )}
          <span>{ended && 'ended'} on </span>
          {endsAtFormatted}
        </span>
      )}
      {isStopped && (
        <>
          {status} on {stoppedTime}
        </>
      )}
      {isSold && (
        <>
          <span>sold on </span>
          {soldTime}
        </>
      )}
    </div>
  );
};

export default Status;
