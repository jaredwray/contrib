import resizedImageUrl from '../resizedImageUrl';

test('it should return url concat _size', () => {
  expect(resizedImageUrl('https://storage.googleapis.com/', 120)).toBe('https://storage.googleapis_120.com');
});
test('it should return url', () => {
  expect(resizedImageUrl('https://test', 120)).toBe('https://test');
});
