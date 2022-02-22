import { getShortLink } from '../getShortLink';

beforeAll(() => {
  process.env = { ...process.env, REACT_APP_PLATFORM_URL: 'https://dev.contrib.org' };
});

describe('getShortLink', () => {
  test('it returns short url', () => {
    expect(getShortLink('testSlug')).toBe(`${process.env.REACT_APP_PLATFORM_URL}/go/testSlug`);
  });
});
