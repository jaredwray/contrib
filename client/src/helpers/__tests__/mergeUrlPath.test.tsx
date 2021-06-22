import { mergeUrlPath } from '../mergeUrlPath';

test('merge 1 and 2 to equal 1/2', () => {
  expect(mergeUrlPath('1', '2')).toBe('1/2');
});
test('merge undefined and 2 to equal /2', () => {
  expect(mergeUrlPath(undefined, '2')).toBe('/2');
});
