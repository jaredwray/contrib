import AuctionPage from '../';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { AuctionQuery, AuctionSubscription } from 'src/apollo/queries/auctions';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/Layout';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    push: mockHistoryFn,
    replace: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/auctions/testId' }),
}));
const auction = {
  currentPrice: { amount: 112200, currency: 'USD', precision: 2 },
  endDate: '2021-08-29T08:05:21.000Z',
  followers: [{ createdAt: '2021-06-28T12:52:49.463Z', user: '60d9ac0f650c813a783906b0' }],
  isActive: false,
  isDraft: false,
  isFailed: false,
  isPending: false,
  isSettled: false,
  isSold: false,
  isStopped: true,
  status: 'ACTIVE',
  stoppedAt: null,
  totalBids: 1,
  winner: 'test',
};

const cache = new InMemoryCache();
const cache2 = new InMemoryCache();
const cache3 = new InMemoryCache();
const nullDataCache = new InMemoryCache();

cache.writeQuery({
  query: AuctionSubscription,
  variables: { id: 'testId' },
  data: {
    auction,
  },
});
nullDataCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: null,
  },
});

cache2.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: AuctionQueryAuction,
  },
});

describe('AuctionPage ', () => {
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
              <AuctionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <MockedProvider>
            <AuctionPage />
          </MockedProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('should redirect to Home page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2}>
              <AuctionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toHaveBeenCalledTimes(1);
  });
});
