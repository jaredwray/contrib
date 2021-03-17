import { set } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const serializeStartDate = ({
  date,
  time,
  dayPeriod,
  timeZone,
}: {
  date: Date;
  time: string;
  dayPeriod: 'am' | 'pm';
  timeZone: string;
}) => {
  const [hours, minutes] = time.split(':').map((a: string) => parseInt(a, 10));
  const fullHour = dayPeriod === 'am' ? hours : hours + 12;

  const newDate = set(date, { hours: fullHour, minutes });

  return zonedTimeToUtc(newDate, timeZone).toISOString();
};
