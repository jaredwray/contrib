import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { CardInput } from 'src/components/forms/inputs/CardInput';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';

import DeliveryPaymentPage from '..';
import Form from 'src/components/forms/Form/Form';
import Select from 'src/components/forms/selects/Select';
import { testAccount } from 'src/helpers/testHelpers/account';
import { AuctionQuery, ShippingRegistrationMutation, CalculateShippingCostQuery } from 'src/apollo/queries/auctions';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import { withAuthenticatedUser, mockedUseAuth0 } from 'src/helpers/testHelpers/auth0';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

import Layout from 'src/components/layouts/Layout';
import WithStripe from 'src/components/wrappers/WithStripe';

const mockHistoryFn = jest.fn();

jest.mock('@stripe/react-stripe-js', () => {
  const Actual = jest.requireActual('@stripe/react-stripe-js');
  return {
    ...Actual,
    useElements: () => ({ test: 'test' }),
  };
});

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
const e: StripeCardElementChangeEvent = {
  brand: 'visa',
  complete: false,
  elementType: 'card',
  empty: false,
  error: undefined,
  value: { postalCode: '11111' },
};

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
      delivery: { ...AuctionQueryAuction.delivery, status: 'DELIVERY_PAID' },
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
cache4.writeQuery({
  query: CalculateShippingCostQuery,
  variables: {
    deliveryMethod: '03',
    auctionId: 'testId',
  },
  data: {
    calculateShippingCost: {
      deliveryPrice: { amount: 1, currency: 'USD' },
      timeInTransit: '2021-09-23T21:00:00.000Z',
    },
  },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: ShippingRegistrationMutation,
      variables: {
        timeInTransit: '2021-09-23T21:00:00.000Z',
        deliveryMethod: '03',
        auctionId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          shippingRegistration: {
            deliveryPrice: { amount: 1, currency: 'USD' },
            identificationNumber: 'test',
          },
        },
      };
    },
  },
];
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
              <WithStripe>
                <DeliveryPaymentPage />
              </WithStripe>
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
                <WithStripe>
                  <DeliveryPaymentPage />
                </WithStripe>
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
                <WithStripe>
                  <DeliveryPaymentPage />
                </WithStripe>
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      expect(mockHistoryFn).toHaveBeenCalled();
    });
  });
  it('component should redirect when auctions status is DELIVERY_PAID ', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache2}>
                <WithStripe>
                  <DeliveryPaymentPage />
                </WithStripe>
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('component should redirect when auctions status is not ADDRESS_PROVIDED', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache3}>
                <WithStripe>
                  <DeliveryPaymentPage />
                </WithStripe>
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('component is defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache4}>
                <WithStripe>
                  <DeliveryPaymentPage />
                </WithStripe>
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
      expect(wrapper.find(StepByStepPageLayout)).toHaveLength(1);

      wrapper.find(Select).prop('onChange')('03');
      expect(wrapper.find(Select).text()).toEqual('UPS Ground');

      wrapper.find(CardInput).prop('handleAddCard')!();
      wrapper.find(CardInput).prop('onCancel')!();
      wrapper.find(CardInput).prop('onChange')!(e);
      expect(wrapper.find(CardInput).text()).toEqual('Visa **** **** **** 4242, 5/26Use another card');

      wrapper!.find(StepByStepPageLayout).prop('prevAction')!();
      expect(mockHistoryFn).toHaveBeenCalled();
    });
  });
  it('component is defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache4} mocks={mocks}>
                <WithStripe>
                  <DeliveryPaymentPage />
                </WithStripe>
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
      wrapper.find(CardInput).prop('onChange')!(e);
      expect(wrapper.find(CardInput).text()).toEqual('Visa **** **** **** 4242, 5/26Use another card');

      wrapper!.find(Form).props().onSubmit({});
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
