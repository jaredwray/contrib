import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Layout from 'src/components/layouts/Layout';
import Form from 'src/components/forms/Form/Form';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { testAccount } from 'src/helpers/testHelpers/account';
import { auctionForCreation as auction } from 'src/helpers/testHelpers/auction';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';

import PrivateAuction from '../PrivateAuction';

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    replace: mockHistoryFn,
    push: mockHistoryFn,
    goBack: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));
const cache = new InMemoryCache();
cache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction,
  },
});

describe('PrivateAuction ', () => {
  describe('for not logged in user', () => {
    it('returns null', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider>
                <PrivateAuction />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(wrapper!.find(Layout)).toHaveLength(0);
    });
  });
  describe('for not admin', () => {
    testAccount.isAdmin = false;

    it('returns null', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <UserAccountContext.Provider value={testAccount}>
                <MockedProvider>
                  <PrivateAuction />
                </MockedProvider>
              </UserAccountContext.Provider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(wrapper!.find(Layout)).toHaveLength(0);
    });
  });
  describe('for admin', () => {
    testAccount.isAdmin = true;

    it('returns component', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <UserAccountContext.Provider value={testAccount}>
                <MockedProvider cache={cache}>
                  <PrivateAuction />
                </MockedProvider>
              </UserAccountContext.Provider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(Layout)).toHaveLength(1);

      wrapper!.find(StepByStepPageLayout).prop('prevAction')!();
      expect(mockHistoryFn).toHaveBeenCalled();
    });
  });
});
