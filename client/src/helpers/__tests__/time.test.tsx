import { formatTimeZone } from '../time';

describe('time', () => {
  jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime());

  test('it should transform date', () => {
    expect(formatTimeZone(new Date(), 'America/Los_Angeles')).toBe('2020-01-01T00:00:00.000Z');
  });
});
