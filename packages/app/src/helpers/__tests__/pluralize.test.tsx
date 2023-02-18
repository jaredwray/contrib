import { pluralize } from '../pluralize';

test('pluralize 1 and auction to "1 auction"', () => {
  expect(pluralize(1, 'auction')).toBe('1 auction');
});
test('pluralize 2 and auction to "2 auctions"', () => {
  expect(pluralize(2, 'auction')).toBe('2 auctions')
});
