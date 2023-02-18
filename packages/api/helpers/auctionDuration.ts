import { Dayjs } from 'dayjs';

import { AppLogger } from '../logger';

const ALLOWABLE_DURATION_VALUES = [1, 2, 3, 5, 8];

export const auctionDuration = ({ startsAt, endsAt }: { startsAt: Dayjs; endsAt: Dayjs }): number => {
  const duration = endsAt.diff(startsAt, 'days');

  if (ALLOWABLE_DURATION_VALUES.includes(duration)) return duration;

  AppLogger.error(`Incorrect auction duration: ${duration}!`);

  const closestDuration =
    ALLOWABLE_DURATION_VALUES.reverse().find((value) => value <= duration) || Math.min(...ALLOWABLE_DURATION_VALUES);

  return closestDuration;
};
