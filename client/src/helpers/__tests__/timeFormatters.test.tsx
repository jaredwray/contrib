import { sub, add } from 'date-fns';

import { toHumanReadableDuration, toFullHumanReadableDatetime } from '../timeFormatters';

describe('toHumanReadableDuration', () => {
  jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime());

  test('it should return null', () => {
    expect(toHumanReadableDuration(new Date().toISOString())).toBe(null);
  });

  test('returns correct value for past date in days', () => {
    expect(toHumanReadableDuration(sub(new Date(), { days: 2 }).toISOString())).toBe('Ended');
  });

  test('returns correct value for past time in hours', () => {
    expect(toHumanReadableDuration(sub(new Date(), { hours: 2 }).toISOString())).toBe('Ended');
  });

  test('returns correct value for future time in minutes', () => {
    expect(toHumanReadableDuration(sub(new Date(), { minutes: 10 }).toISOString())).toBe('10M');
  });

  test('returns correct value for future date in days', () => {
    expect(toHumanReadableDuration(add(new Date(), { days: 1 }).toISOString())).toBe('1D');
  });
});

describe('toFullHumanReadableDatetime', () => {
  test('returns correct value', () => {
    expect(toFullHumanReadableDatetime(new Date('June 20, 2021 00:20:00'))).toBe('06/20/21 @ 12:20 AM');
  });
});
