import { getShortLink } from '../getShortLink';

beforeAll(() => {
  process.env = { ...process.env, REACT_APP_PLATFORM_URL: 'https://dev.contrib.org' };
});

test('it should return url', () => {
  expect(getShortLink('testSlug')).toBe(`${process.env.REACT_APP_PLATFORM_URL}/go/testSlug`);
});
