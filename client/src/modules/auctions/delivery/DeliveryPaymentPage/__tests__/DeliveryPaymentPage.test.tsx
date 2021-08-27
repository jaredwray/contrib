import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import DeliveryPaymentPage from '..';
import { testAccount } from 'src/helpers/testHelpers/account';
import { AuctionQuery } from 'src/apollo/queries/auctions';
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
  }),
  useParams: () => ({
    auctionId: 'testId',
  }),
}));

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: { auction: AuctionQueryAuction },
});

describe('DeliveryPaymentPage', () => {
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
  xit('component should redirect without account', async () => {
    withAuthenticatedUser();
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
  xit('component should redirect without winner', async () => {
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
});
