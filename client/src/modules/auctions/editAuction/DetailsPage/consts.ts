import { getTimeZone } from './utils';

export const durationOptions = [
  { value: '1', label: '1 Day' },
  { value: '2', label: '2 Days' },
  { value: '3', label: '3 Days' },
  { value: '5', label: '5 Days' },
  { value: '8', label: '8 Days' },
];

export const utcTimeZones = [
  { value: 'America/Los_Angeles', label: getTimeZone('America/Los_Angeles') },
  { value: 'America/Denver', label: getTimeZone('America/Denver') },
  { value: 'America/Chicago', label: getTimeZone('America/Chicago') },
  { value: 'America/New_York', label: getTimeZone('America/New_York') },
];
