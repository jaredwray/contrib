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

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    slug: 'testSlug',
  }),
  useHistory: () => ({
    push: mockHistoryFn,
    replace: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/auctions/testId' }),
}));

const mockFn = jest.fn();

cache.writeQuery({
  query: GetLinkQuery,
  variables: { slug: 'testSlug' },
  data: {
    id: 'testId',
    link: 'testLink',
  },
});

const mocks = [
  {
    request: {
      query: UpdateOrCreateAuctionMetricsMutation,
      variables: { shortLinkId: 'testShortLinkId', country: 'test country', referrer: 'test referrer' },
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

describe('AuctionMetricsUpdatePage ', () => {
  it('component is defined', async () => {
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
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
  });
});
