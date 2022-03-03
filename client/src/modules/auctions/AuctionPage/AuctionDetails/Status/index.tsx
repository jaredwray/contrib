import { FC, ReactElement, useEffect, useState } from 'react';

import { format as dateFormat, differenceInSeconds } from 'date-fns';
import { format, toDate } from 'date-fns-tz';

import { toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auction: Auction;
  canBid: boolean;
  ended: boolean;
}

const Status: FC<Props> = ({ auction, canBid, ended }): ReactElement => {
  const [minutesWithoutReload, SetMinutesinterval] = useState(0);
  const { endDate, isSold, isStopped, stoppedAt, status } = auction;
  const durationTillEnd = toHumanReadableDuration(endDate);
  const endDateFormatted = dateFormat(new Date(endDate), 'EEEE, dd, hh:mma');
  const secondsLeft = differenceInSeconds(toDate(endDate), new Date());

  let callAfterMs = 60000;
  let soldTime = '';
  let stoppedTime = '';

  if (secondsLeft <= 120) callAfterMs = 1000;
  if (isSold && stoppedAt) soldTime = format(new Date(stoppedAt), 'MMM dd yyyy p');
  if (isStopped && stoppedAt) stoppedTime = format(new Date(stoppedAt), 'MMM dd yyyy');

  useEffect(() => {
    if (!canBid) return;
    const timer = setInterval(() => {
      SetMinutesinterval((minutesWithoutReload) => minutesWithoutReload + 1);
    }, callAfterMs);
    return () => clearInterval(timer);
  }, [canBid, minutesWithoutReload, secondsLeft, callAfterMs]);

  return (
    <div className="text-body-new text-center pt-2 pb-2">
      {!isSold && (
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
