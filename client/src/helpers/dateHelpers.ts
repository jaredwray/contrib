import { format } from 'date-fns-tz';

export const toFormatedDate = (value: string | Date) => format(new Date(value), 'MMM dd yyyy HH:mm XXX');
