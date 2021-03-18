import { differenceInHours, differenceInMinutes, format, parseISO } from 'date-fns';
import { toDate } from 'date-fns-tz';

export function toHumanReadableDatetime(date: string): string | null {
  const hours = differenceInHours(toDate(date), new Date());

  if (hours < 0) {
    return null;
  }

  if (hours === 0) {
    const minutes = differenceInMinutes(toDate(date), new Date());
    return minutes ? `${minutes}m` : null;
  }

  const hoursLeft = hours % 24;
  const daysLeft = Math.floor(hours / 24);
  const left = [daysLeft ? `${daysLeft}d` : '', hoursLeft ? `${hoursLeft}h` : ''];

  return left.join(' ');
}

export function toFullHumanReadableDatetime(date: string): string | null {
  const currentDate = toDate(parseISO(date));
  const day = format(currentDate, 'd.mm.yy');
  const time = format(currentDate, 'hh:mm');
  const dayPeriod = format(currentDate, 'a');
  const currentTimeZone = format(currentDate, 'x');

  return `${day} @ ${time} ${dayPeriod} ${currentTimeZone}`;
}
