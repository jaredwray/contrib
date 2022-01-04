import ShortLinkPage from '../index';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { UpdateOrCreateAuctionMetricsMutation } from 'src/apollo/queries/auctions';
import { GetLinkQuery } from 'src/apollo/queries/shortLink';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';

const withAnotherHostCahe = new InMemoryCache();
const withNullLinkCahe = new InMemoryCache();
const withSameHostCache = new InMemoryCache();
const withLinkNotToTheAuctionPageCache = new InMemoryCache();
const mockHistoryReplaceFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    slug: 'testSlug',
  }),
  useHistory: () => ({
    replace: mockHistoryReplaceFn,
  }),
  useRouteMatch: () => ({ url: 'auctions/testId' }),
}));

delete global.window.location;
global.window = Object.create(window);
global.window.location = {
  port: '123',
  protocol: 'http:',
  hostname: 'localhost',
};

const mockFn = jest.fn();
let assignMock = jest.fn();

delete window.location;
window.location = { assign: assignMock };

withAnotherHostCahe.writeQuery({
  query: GetLinkQuery,
  variables: { slug: 'testSlug' },
  data: {
    getLink: {
      id: 'testId',
      link: 'http://example.com/auctions/61a8a97964b524183c831b70',
    },
  },
});

withNullLinkCahe.writeQuery({
  query: GetLinkQuery,
  variables: { slug: 'testSlug' },
  data: {
    getLink: {
      id: 'testId',
      link: null,
    },
  },
});

withSameHostCache.writeQuery({
  query: GetLinkQuery,
  variables: { slug: 'testSlug' },
  data: {
    getLink: {
      id: 'testId',
      link: 'http://localhost/auctions/61a8a97964b524183c831b70',
    },
  },
});

withLinkNotToTheAuctionPageCache.writeQuery({
  query: GetLinkQuery,
  variables: { slug: 'testSlug' },
  data: {
    getLink: {
      id: 'testId',
      link: 'http://localhost/auctions/61a8a97964b524183c831b70/delivery/address',
    },
  },
});

const mocks = [
  {
    request: {
      query: UpdateOrCreateAuctionMetricsMutation,
      variables: {
        shortLinkId: 'testId',
        country: 'BY',
        referrer: 'direct',
        userAgentData: window.navigator.userAgent,
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateOrCreateMetrics: {
            id: 'testId',
          },
        },
      };
    },
  },
];

const unmockedFetch = global.fetch;

beforeEach(() => {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve({ country: 'BY' }),
    });
});

afterEach(() => {
  global.fetch = unmockedFetch;
  assignMock.mockClear();
});

describe('ShortLinkPage ', () => {
  describe('Go to the page with null link', () => {
    it('redirects to 404 page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={withNullLinkCahe}>
                <ShortLinkPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });

      await new Promise((resolve) => setTimeout(resolve));
      wrapper!.update();

      expect(mockHistoryReplaceFn).toBeCalled();
      expect(mockHistoryReplaceFn.mock.calls[0][0]).toBe('/404');
    });
  });

  describe('Go to the page with link on the same host', () => {
    it('redirects to the link', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={withSameHostCache} mocks={mocks}>
                <ShortLinkPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });

      await new Promise((resolve) => setTimeout(resolve));
      wrapper!.update();

      expect(mockHistoryReplaceFn).toBeCalled();
      expect(mockHistoryReplaceFn.mock.calls[0][0]).toBe('/auctions/61a8a97964b524183c831b70');
    });
  });

  describe('Go to the page with link on the another host', () => {
    it('redirects to the link', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={withAnotherHostCahe} mocks={mocks}>
                <ShortLinkPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });

      await new Promise((resolve) => setTimeout(resolve));
      wrapper!.update();

      expect(window.location.href).toEqual('http://example.com/auctions/61a8a97964b524183c831b70');
    });
  });

  describe('Go to the page with link not to the auction page', () => {
    it('redirects to the link', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={withLinkNotToTheAuctionPageCache} mocks={mocks}>
                <ShortLinkPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });

      await new Promise((resolve) => setTimeout(resolve));
      wrapper!.update();

      expect(mockHistoryReplaceFn).toBeCalled();
      expect(mockHistoryReplaceFn.mock.calls[0][0]).toBe('/auctions/61a8a97964b524183c831b70/delivery/address');
    });
  });
});
