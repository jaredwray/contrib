import ResizedImageUrl from '../ResizedImageUrl';

test('it should return url concat _size', () => {
  expect(ResizedImageUrl('https://storage.googleapis.com/', 120)).toBe('https://storage.googleapis_120.com');
});
test('it should return url', () => {
  expect(ResizedImageUrl('https://test', 120)).toBe('https://test');
});
