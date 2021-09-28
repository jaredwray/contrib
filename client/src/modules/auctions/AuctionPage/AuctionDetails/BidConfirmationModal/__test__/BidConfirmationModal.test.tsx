import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import { loadStripe } from '@stripe/stripe-js';
import { MemoryRouter } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import { testAccount } from 'src/helpers/testHelpers/account';
import { BuyAuctionMutation } from 'src/apollo/queries/auctions';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

import { BidConfirmationModal } from '../BidConfirmationModal';

const mockElement = () => ({
  mount: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  update: jest.fn(),
});

const mockElements = () => {
  const elements: any = {};
  return {
    create: jest.fn((type) => {
      elements[type] = mockElement();
      return elements[type];
    }),
    getElement: jest.fn((type) => {
      return elements[type] || null;
    }),
  };
};
const mockStripe = () => ({
  elements: jest.fn(() => mockElements()),
  // createToken: jest.fn(() => ({ token: { id: 'testToken' } })),
  createToken: jest.fn(),
  createSource: jest.fn(),
  createPaymentMethod: jest.fn(),
  confirmCardPayment: jest.fn(),
  confirmCardSetup: jest.fn(),
  paymentRequest: jest.fn(),
  _registerWrapper: jest.fn(),
});

jest.mock('@stripe/react-stripe-js', () => {
  const stripe = jest.requireActual('@stripe/react-stripe-js');

  return {
    ...stripe,
    Element: () => {
      return mockElement;
    },
    useStripe: () => {
      return mockStripe;
    },
    useElements: () => {
      return mockElements;
    },
  };
});
jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

jest.mock('@stripe/react-stripe-js', () => {
  const stripe = jest.requireActual('@stripe/react-stripe-js');

  return {
    ...stripe,
    Element: () => {
      return mockElement;
    },
    useStripe: () => {
      return mockStripe;
    },
    useElements: () => {
      return mockElements;
    },
  };
});
const props: any = {
  auctionId: 'testId',
  isBuying: true,
  setIsBuying: jest.fn(),
};
const props2: any = {
  ...props,
  isBuying: false,
};
const mockFn = jest.fn();
const mocks = [
  {
    request: {
      query: BuyAuctionMutation,
      variables: { id: 'testId' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          buyAuction: {
            status: 'SOLD',
          },
        },
      };
    },
  },
  {
    request: {
      query: RegisterPaymentMethodMutation,
      variables: { token: 'testToken' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          enterPaymentInformation: {
            id: 'testId',
            paymentInformation: {
              cardBrand: 'Visa',
              cardExpirationMonth: 5,
              cardExpirationYear: 2026,
              cardNumberLast4: '4242',
              id: 'testId',
            },
          },
        },
      };
    },
  },
];
const errorMocks = [
  {
    request: {
      query: BuyAuctionMutation,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
  {
    request: {
      query: RegisterPaymentMethodMutation,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
];

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? '');

describe('BidConfirmationModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const e: any = Event;
  test('renders without crashing', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <Elements stripe={stripePromise}>
                <BidConfirmationModal {...props} />
              </Elements>
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!).toHaveLength(1);
  });
  test('should call the BuyAuctionMutation', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <Elements stripe={stripePromise}>
                <BidConfirmationModal {...props} />
              </Elements>
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find("[data-test-id='bid-button']").first().text()).toEqual('Buy it now');
    await act(async () => {
      wrapper!.find("[data-test-id='bid-button']").first().prop('onClick')!(e);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  test('should not call BuyAuctionMutation becouse of error', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={errorMocks}>
              <Elements stripe={stripePromise}>
                <BidConfirmationModal {...props} />
              </Elements>
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find("[data-test-id='bid-button']").first().prop('onClick')!(e);
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  test('', async () => {
    let wrapper: ReactWrapper;
    const account = { account: { ...testAccount.account, paymentInformation: null } };
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={account}>
              <MockedProvider mocks={mocks}>
                <Elements stripe={stripePromise}>
                  <BidConfirmationModal {...props2} />
                </Elements>
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!.find("[data-test-id='bid-button']").first().text()).toEqual('Confirm bidding');
    await new Promise((resolve) => setTimeout(resolve));
    await act(async () => {
      wrapper!.find("[data-test-id='bid-button']").first().prop('onClick')!(e);
    });
  });
});
