import { utcToZonedTime, format, zonedTimeToUtc } from 'date-fns-tz';

export const formatTimeZone = (value: Date, timeZone: string) =>
  zonedTimeToUtc(utcToZonedTime(value, timeZone), timeZone).toISOString();
