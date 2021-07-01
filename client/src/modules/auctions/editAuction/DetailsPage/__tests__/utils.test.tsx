import { serializeStartDate, getTimeZone } from '../utils';

const prop = { date: new Date('2021-06-23T08:00:18.000Z'), time: '01:14', timeZone: 'America/Los_Angeles' };
test('it should change date"', () => {
  expect(serializeStartDate(prop)).toBe('2021-06-23T08:14:00.000Z');
});
test('it should return short timezone', () => {
  expect(getTimeZone(prop.timeZone)).toBe('PDT');
});
