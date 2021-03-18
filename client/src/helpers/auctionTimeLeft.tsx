import { differenceInHours, differenceInMinutes } from 'date-fns';
import { toDate } from 'date-fns-tz';

export function auctionTimeLeft(date: Date): string | null {
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
