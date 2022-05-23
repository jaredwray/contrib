import { differenceInHours, differenceInMinutes, format } from 'date-fns';
import { toDate } from 'date-fns-tz';

export function toHumanReadableDuration(date: string): string | null {
  let hours = differenceInHours(toDate(date), new Date());
  const minutes = differenceInMinutes(toDate(date), new Date());
  let inPast = false;

  if (hours < 0) {
    hours = Math.abs(hours);
    inPast = true;
  }

  if (hours === 0) {
    const minutes = Math.abs(differenceInMinutes(toDate(date), new Date()));
    return minutes ? `${minutes}m` : null;
  }

  const hoursLeft = hours % 24;
  const daysLeft = Math.floor(hours / 24);
  const minutesLeft = minutes - Math.floor(minutes / 60) * 60;
  const left = [daysLeft ? `${daysLeft}d` : '', hoursLeft ? `${hoursLeft}h` : '', minutesLeft ? `${minutesLeft}m` : ''];

  if (inPast) left.push('ago');

  return left.filter(Boolean).join(' ');
}

export const toFullHumanReadableDatetime = (prop: Date): string | null => {
  const date = toDate(prop);
  const day = format(date, 'd.MM.yy');
  const time = format(date, 'hh:mm a');

  return `${day} @ ${time}`;
};

export const toFormatedDate = (value: string | Date, timeFormat = 'MMM dd yyyy HH:mm XXX') =>
  format(new Date(value), timeFormat);
