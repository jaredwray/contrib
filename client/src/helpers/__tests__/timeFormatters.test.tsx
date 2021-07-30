import { toHumanReadableDuration, toFullHumanReadableDatetime } from '../timeFormatters';
import { sub, add } from 'date-fns';
describe('timeFormatters', () => {
  jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime());

  test('it should return null', () => {
    expect(toHumanReadableDuration(new Date().toISOString())).toBe(null);
  });

  test('it should return "2d ago"', () => {
    expect(toHumanReadableDuration(sub(new Date(), { days: 2 }).toISOString())).toBe('2d ago');
  });

  test('it should return "2h ago"', () => {
    expect(toHumanReadableDuration(sub(new Date(), { hours: 2 }).toISOString())).toBe('2h ago');
  });

  test('it should return "10m"', () => {
    expect(toHumanReadableDuration(sub(new Date(), { minutes: 10 }).toISOString())).toBe('10m');
  });

  test('it should return "1d"', () => {
    expect(toHumanReadableDuration(add(new Date(), { days: 1 }).toISOString())).toBe('1d');
  });

  test('it should transform date', () => {
    expect(toFullHumanReadableDatetime(new Date('June 20, 2021 00:20:00'))).toBe('20.06.21 @ 12:20 AM');
  });
});
