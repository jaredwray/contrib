import { expirationDate } from '../expirationDate';
jest.useFakeTimers('modern').setSystemTime(new Date('2021').getTime());
const e: any = { target: { value: '' } };
const setMonth = jest.fn();
const setYear = jest.fn();
test('it should replace value 5 to 05', () => {
  expirationDate(e, '15', 2, 'expirationDateMonth', { current: null }, { current: null }, setMonth, setYear);
  expect(e.target.value).toBe('12');
  expect(setMonth).toBeCalledTimes(1);
});
test('it should replace 00 in to 01', () => {
  expirationDate(e, '00', 2, 'expirationDateMonth', { current: null }, { current: null }, setMonth, setYear);
  expect(e.target.value).toBe('01');
});
test('it should replace 00 in to 01', () => {
  expirationDate(e, '2', 2, 'expirationDateMonth', { current: null }, { current: null }, setMonth, setYear);
  expect(e.target.value).toBe('1');
});
test('it should replace first number of year to 2', () => {
  expirationDate(e, '1', 2, 'expirationDateYear', { current: null }, { current: null }, setMonth, setYear);
  expect(e.target.value).toBe('2');
});
test('it should replace 20 to 21', () => {
  expirationDate(e, '20', 2, 'expirationDateYear', { current: null }, { current: null }, setMonth, setYear);
  expect(e.target.value).toBe('21');
});
test('it should replace first number of year to 3', () => {
  expirationDate(e, '4', 2, 'expirationDateYear', { current: null }, { current: null }, setMonth, setYear);
  expect(e.target.value).toBe('3');
});
test('it should replace 99 to 31', () => {
  expirationDate(e, '99', 2, 'expirationDateYear', { current: null }, { current: null }, setMonth, setYear);
  expect(e.target.value).toBe('31');
});
