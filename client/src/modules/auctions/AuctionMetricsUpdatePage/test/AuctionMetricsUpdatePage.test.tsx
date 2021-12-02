import AuctionMetricsUpdatePage from '../index';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { UpdateOrCreateAuctionMetricsMutation } from 'src/apollo/queries/auctions';
import { GetLinkQuery } from 'src/apollo/queries/shortLink';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';

const cache = new InMemoryCache();
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

cache.writeQuery({
  query: GetLinkQuery,
  variables: { slug: 'testSlug' },
  data: {
    getLink: {
      id: 'testId',
      link: 'auctionstestLink',
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

describe('AuctionMetricsUpdatePage ', () => {
  describe('with link to the auction page', () => {
    beforeEach(() => {
      cache.writeQuery({
        query: GetLinkQuery,
        variables: { slug: 'testSlug' },
        data: {
          getLink: {
            id: 'testId',
            link: 'http://example.com/auctions/auctionId',
          },
        },
      });
    });

    describe('with invalid id', () => {
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
                  id: null,
                },
              },
            };
          },
        },
      ];

      xit('redirects to 404 page', async () => {
        let wrapper: ReactWrapper;
        await act(async () => {
          wrapper = mount(
            <MemoryRouter>
              <ToastProvider>
                <MockedProvider cache={cache} mocks={mocks}>
                  <AuctionMetricsUpdatePage />
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

    describe('when cannot receive data from ipapi.co', () => {
      it('redirects to 404 page', async () => {
        let wrapper: ReactWrapper;
        try {
          await act(async () => {
            wrapper = mount(
              <MemoryRouter>
                <ToastProvider>
                  <MockedProvider cache={cache} mocks={mocks}>
                    <AuctionMetricsUpdatePage />
                  </MockedProvider>
                </ToastProvider>
              </MemoryRouter>,
            );
            await new Promise((resolve) => setTimeout(resolve));
            wrapper.update();
          });
        } catch (e) {
          expect(mockHistoryReplaceFn).toBeCalled();
          expect(mockHistoryReplaceFn.mock.calls[0][0]).toBe('/404');
        }
      });
    });

    describe('with valid id', () => {
      describe('when the link is on the same host', () => {
        beforeEach(() => {
          cache.writeQuery({
            query: GetLinkQuery,
            variables: { slug: 'testSlug' },
            data: {
              getLink: {
                id: 'testId',
                link: 'http://localhost/auctions/auctionId',
              },
            },
          });
        });
        it('redirects to the link', async () => {
          let wrapper: ReactWrapper;
          await act(async () => {
            wrapper = mount(
              <MemoryRouter>
                <ToastProvider>
                  <MockedProvider cache={cache} mocks={mocks}>
                    <AuctionMetricsUpdatePage />
                  </MockedProvider>
                </ToastProvider>
              </MemoryRouter>,
            );
            await new Promise((resolve) => setTimeout(resolve));
            wrapper.update();
          });
          expect(mockHistoryReplaceFn).toBeCalled();
          expect(mockHistoryReplaceFn.mock.calls[0][0]).toBe('/auctions/auctionId');
        });
      });

      describe('when the link is on another host', () => {
        it('redirects to the link', async () => {
          let wrapper: ReactWrapper;
          await act(async () => {
            wrapper = mount(
              <MemoryRouter>
                <ToastProvider>
                  <MockedProvider cache={cache} mocks={mocks}>
                    <AuctionMetricsUpdatePage />
                  </MockedProvider>
                </ToastProvider>
              </MemoryRouter>,
            );
            await new Promise((resolve) => setTimeout(resolve));
            wrapper.update();
          });
          expect(window.location.href).toEqual('http://example.com/auctions/auctionId');
        });
      });
    });
  });

  describe('with link not to the auction page', () => {
    beforeEach(() => {
      cache.writeQuery({
        query: GetLinkQuery,
        variables: { slug: 'testSlug' },
        data: {
          getLink: {
            id: 'testId',
            link: 'http://example.com/',
          },
        },
      });
    });

    it('redirects to the link', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={cache} mocks={mocks}>
                <AuctionMetricsUpdatePage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(window.location.href).toEqual('http://example.com/');
    });
  });
});
