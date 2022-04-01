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

import BidsStepPage from '../BidsStepPage';

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
const cache2 = new InMemoryCache();
const nullDataCache = new InMemoryCache();
const undefinedlDataCache = new InMemoryCache();
cache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction,
  },
});
cache2.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...auction,
      isActive: false,
    },
  },
});

nullDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: { auction: null },
});

undefinedlDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: { auction: undefined },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: UpdateAuctionMutation,
      variables: { id: 'testId', bidStep: { amount: 100, currency: 'USD', precision: 2 } },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateAuction: {
            id: 'testId',
            description: 'test',
            title: 'test',
            link: 'test',
            startDate: '2021-07-01T22:28:00.261Z',
            endDate: '2021-08-14T19:01:00.232Z',
            startPrice: { amount: 100, currency: 'USD', precision: 2 },
            bidStep: null,
            charity: {
              id: 'testId',
              name: 'test',
            },
            fairMarketValue: { amount: 100, currency: 'USD', precision: 2 },
            items: [],
          },
        },
      };
    },
  },
];
const submitValues = {
  bidStep: { amount: 100, currency: 'USD', precision: 2 },
};
const submitErrorValues = {
  bidStep: { amount: 10, currency: 'USD', precision: 2 },
};
describe('BidsStepPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <BidsStepPage />
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
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache}>
                <BidsStepPage />
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
  it('component should return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={undefinedlDataCache}>
              <BidsStepPage />
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
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
              <BidsStepPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('component should redirect if isActive true', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <BidsStepPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toBeCalled();
  });
});
