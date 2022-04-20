import { mount, ReactWrapper } from 'enzyme';
import { Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { createMemoryHistory } from 'history';

import { AuctionQuery, AuctionSubscription } from 'src/apollo/queries/auctions';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import Layout from 'src/components/layouts/Layout';
import { testAccount } from 'src/helpers/testHelpers/account';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

import AuctionPage from '../';

const history = createMemoryHistory();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ auctionId: 'testId' }),
  useRouteMatch: () => ({ url: '/auctions/testId' }),
}));

const owner = {
  ...testAccount,
  influencerProfile: AuctionQueryAuction.auctionOrganizer,
};
const draftAuctionCache = new InMemoryCache();
const activeAuctionCache = new InMemoryCache();
const stoppedAuctionCache = new InMemoryCache();
const soldAuctionCache = new InMemoryCache();
const nullAuctionCache = new InMemoryCache();

stoppedAuctionCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: AuctionQueryAuction,
  },
});
nullAuctionCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: null,
  },
});

soldAuctionCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...AuctionQueryAuction, isSold: true, isStopped: false },
  },
});
activeAuctionCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...AuctionQueryAuction, isActive: true, isStopped: false },
  },
});
draftAuctionCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...AuctionQueryAuction, isDraft: true, isStopped: false },
  },
});

const mockAuctionSubscriptionData = {
  followers: [
    {
      user: '222',
      createdAt: '2021-02-18T14:36:35.208+00:00',
    },
  ],
  status: 'testStatus',
  currentPrice: { amount: 1100, currency: 'USD', precision: 2 },
  endsAt: '2021-02-18T14:36:35.208+00:00',
  stoppedAt: null,
  totalBids: 2,
  isActive: true,
  isDraft: false,
  isSettled: false,
  isFailed: false,
  isSold: false,
  isStopped: false,
};

const activeAuctionMock = [
  {
    request: {
      query: AuctionSubscription,
    },
    newData: () => {
      return {
        data: {
          auction: mockAuctionSubscriptionData,
        },
      };
    },
  },
];

const errorMock = [
  {
    request: {
      query: AuctionSubscription,
    },
    newData: () => {
      return {
        data: {
          auction: null,
        },
      };
    },
  },
];

const stoppedAuctionMock = [
  {
    request: {
      query: AuctionSubscription,
    },
    newData: () => {
      return {
        data: {
          auction: {
            ...mockAuctionSubscriptionData,
            isActive: false,
            stoppedAt: '2021-02-18T14:36:35.208+00:00',
            isStopped: true,
          },
        },
      };
    },
  },
];

describe('AuctionPage', () => {
  describe('when invalid id provided', () => {
    it('redirects to 404 page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <Router history={history}>
            <ToastProvider>
              <MockedProvider cache={nullAuctionCache} mocks={errorMock}>
                <AuctionPage />
              </MockedProvider>
            </ToastProvider>
          </Router>,
        );
      });
      expect(history.location.pathname).toBe(`/404`);
    });
  });

  describe('for an admin', () => {
    it('renders the component for valid auction', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <UserAccountContext.Provider value={testAccount}>
            <Router history={history}>
              <ToastProvider>
                <MockedProvider cache={activeAuctionCache} mocks={activeAuctionMock}>
                  <AuctionPage />
                </MockedProvider>
              </ToastProvider>
            </Router>
          </UserAccountContext.Provider>,
        );
      });
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });

    it('renders the component when the auction is stopped', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <UserAccountContext.Provider value={testAccount}>
            <Router history={history}>
              <ToastProvider>
                <MockedProvider cache={stoppedAuctionCache} mocks={activeAuctionMock}>
                  <AuctionPage />
                </MockedProvider>
              </ToastProvider>
            </Router>
          </UserAccountContext.Provider>,
        );
      });
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });

    it('renders the component when the auction is sold and it is delivery page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <UserAccountContext.Provider value={testAccount}>
            <Router history={history}>
              <ToastProvider>
                <MockedProvider cache={soldAuctionCache} mocks={activeAuctionMock}>
                  <AuctionPage isDeliveryPage={true} />
                </MockedProvider>
              </ToastProvider>
            </Router>
          </UserAccountContext.Provider>,
        );
      });
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });
  });

  describe('for an owner', () => {
    it('renders the component for valid auction', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <UserAccountContext.Provider value={owner}>
            <Router history={history}>
              <ToastProvider>
                <MockedProvider cache={activeAuctionCache} mocks={activeAuctionMock}>
                  <AuctionPage />
                </MockedProvider>
              </ToastProvider>
            </Router>
          </UserAccountContext.Provider>,
        );
      });
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });

    it('renders the component when the auction is stopped', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <UserAccountContext.Provider value={owner}>
            <Router history={history}>
              <ToastProvider>
                <MockedProvider cache={stoppedAuctionCache} mocks={activeAuctionMock}>
                  <AuctionPage />
                </MockedProvider>
              </ToastProvider>
            </Router>
          </UserAccountContext.Provider>,
        );
      });
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });

    it('renders the component when the auction is sold and it is delivery page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <UserAccountContext.Provider value={owner}>
            <Router history={history}>
              <ToastProvider>
                <MockedProvider cache={soldAuctionCache} mocks={activeAuctionMock}>
                  <AuctionPage isDeliveryPage={true} />
                </MockedProvider>
              </ToastProvider>
            </Router>
          </UserAccountContext.Provider>,
        );
      });
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });
  });

  describe('when an account is not logged in', () => {
    it('redirects to the Home page when the auction is stopped', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <Router history={history}>
            <ToastProvider>
              <MockedProvider cache={stoppedAuctionCache} mocks={stoppedAuctionMock}>
                <AuctionPage />
              </MockedProvider>
            </ToastProvider>
          </Router>,
        );
      });
      expect(history.location.pathname).toBe(`/`);
    });

    it('renders the component for valid auction', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <UserAccountContext.Provider value={testAccount}>
            <Router history={history}>
              <ToastProvider>
                <MockedProvider cache={activeAuctionCache} mocks={activeAuctionMock}>
                  <AuctionPage />
                </MockedProvider>
              </ToastProvider>
            </Router>
          </UserAccountContext.Provider>,
        );
      });
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });
  });

  it('returns null when an auction is not loaded yet', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <Router history={history}>
          <MockedProvider mocks={activeAuctionMock}>
            <AuctionPage />
          </MockedProvider>
        </Router>,
      );
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });

  it('redirects to the Home page when the auction is draft', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <Router history={history}>
          <ToastProvider>
            <MockedProvider cache={draftAuctionCache} mocks={activeAuctionMock}>
              <AuctionPage />
            </MockedProvider>
          </ToastProvider>
        </Router>,
      );
    });
    expect(history.location.pathname).toBe(`/`);
  });
});
