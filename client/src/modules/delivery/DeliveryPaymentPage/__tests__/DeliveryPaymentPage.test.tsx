import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import DeliveryPaymentPage from '..';
import { testAccount } from 'src/helpers/testHelpers/account';
import { AuctionQuery } from 'src/apollo/queries/auctions';
import StepByStepPageLayout from 'src/components/StepByStepPageLayout';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import { withAuthenticatedUser, mockedUseAuth0 } from 'src/helpers/testHelpers/auth0';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

import Layout from 'src/components/Layout';

const mockHistoryFn = jest.fn();

jest.mock('@auth0/auth0-react');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryFn,
    goBack: mockHistoryFn,
  }),
  useParams: () => ({
    auctionId: 'testId',
  }),
}));

const cache = new InMemoryCache();
const cache2 = new InMemoryCache();
const cache3 = new InMemoryCache();
const cache4 = new InMemoryCache();

cache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: { auction: AuctionQueryAuction },
});

cache2.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...AuctionQueryAuction,
      delivery: { ...AuctionQueryAuction.delivery, status: 'PAID' },
      winner: { ...AuctionQueryAuction.winner, mongodbId: 'ttestId' },
    },
  },
});
cache3.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...AuctionQueryAuction,
      delivery: { ...AuctionQueryAuction.delivery, status: '' },
      winner: { ...AuctionQueryAuction.winner, mongodbId: 'ttestId' },
    },
  },
});
cache4.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...AuctionQueryAuction,
      winner: { ...AuctionQueryAuction.winner, mongodbId: 'ttestId' },
    },
  },
});
describe('DeliveryPaymentPage', () => {
  beforeEach(() => {
    withAuthenticatedUser();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component returns null', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <UserAccountContext.Provider value={testAccount}>
            <MockedProvider>
              <DeliveryPaymentPage />
            </MockedProvider>
          </UserAccountContext.Provider>
        </ToastProvider>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component should redirect without account', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={{ account: null }}>
              <MockedProvider cache={cache}>
                <DeliveryPaymentPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalled();
  });

  it('component should redirect without winner', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache}>
                <DeliveryPaymentPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      expect(mockHistoryFn).toHaveBeenCalled();
    });
  });
  it('component should redirect when auctions status is PAID', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache2}>
                <DeliveryPaymentPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('component should redirect when auctions status is not PAID or ADDRESS_PROVIDED', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache}>
                <DeliveryPaymentPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('component defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache4}>
                <DeliveryPaymentPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
      expect(wrapper.find(StepByStepPageLayout)).toHaveLength(1);

      wrapper.find('Button').first().simulate('click');
    });
  });
});
