import { set } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const serializeStartDate = ({ date, time, timeZone }: { date: Date; time: string; timeZone: string }) => {
  const [hours, minutes] = time.split(':').map((a: string) => parseInt(a, 10));

  const newDate = set(date, { hours, minutes });

  return zonedTimeToUtc(newDate, timeZone).toISOString();
};
