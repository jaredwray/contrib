import { set } from 'date-fns';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import enUS from 'date-fns/locale/en-US';

export const serializeStartDate = ({ date, time, timeZone }: { date: Date; time: string; timeZone: string }) => {
  const [hours, minutes] = time.split(':').map((a: string) => parseInt(a, 10));
  const newDate = set(date, { hours, minutes, seconds: 0 });
  return zonedTimeToUtc(newDate, timeZone).toISOString();
};

export const getTimeZone = (tz: string) => {
  return format(new Date(), 'zzz', { timeZone: tz, locale: enUS });
};
