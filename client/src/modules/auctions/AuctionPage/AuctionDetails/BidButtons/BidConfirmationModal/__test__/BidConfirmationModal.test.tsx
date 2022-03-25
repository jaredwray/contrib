import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import { loadStripe } from '@stripe/stripe-js';
import { MemoryRouter } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';

import Dialog from 'src/components/modals/Dialog';
import AsyncButton from 'src/components/buttons/AsyncButton';
import { testAccount } from 'src/helpers/testHelpers/account';
import { BuyAuctionMutation } from 'src/apollo/queries/auctions';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import { MakeAuctionBidMutation } from 'src/apollo/queries/bids';
import { CardInput } from 'src/components/forms/inputs/CardInput';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

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
  createToken: () => ({ token: '222' }),
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
  {
    request: {
      query: MakeAuctionBidMutation,
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

  it('renders without crashing', async () => {
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

  describe('when click on Buy now button', () => {
    it('should call the BuyAuctionMutation', async () => {
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
    });

    it('should not call BuyAuctionMutation', async () => {
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
  });

  describe('when click on Confirm Bidding', () => {
    it('should call ConfirmBiddingMutation', async () => {
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

      expect(wrapper!.find("[data-test-id='bid-button']").first().text()).toEqual('Confirm');

      await new Promise((resolve) => setTimeout(resolve));

      await act(async () => {
        wrapper!.find("[data-test-id='bid-button']").first().prop('onClick')!(e);
      });
    });
  });

  describe('when call CardInput props', () => {
    it('Should call CardInput methods', async () => {
      let wrapper: ReactWrapper;

      act(() => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider mocks={mocks}>
                <Elements stripe={stripePromise}>
                  <BidConfirmationModal {...props2} />
                </Elements>
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );

        const CardInputProps = wrapper.find(CardInput).props();
        CardInputProps.handleAddCard();
        CardInputProps.onChange(e);
        CardInputProps.onCancel();
      });
    });
  });

  describe('when call Dialog close method', () => {
    it('Should close Dialog', async () => {
      let wrapper: ReactWrapper;

      act(() => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider mocks={mocks}>
                <Elements stripe={stripePromise}>
                  <BidConfirmationModal {...props2} />
                </Elements>
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );

        wrapper.find(Dialog).props().onClose(e);

        wrapper.update();

        expect(wrapper!.find(Dialog)).toEqual({});
      });
    });
  });

  describe('when call handleBuying method', () => {
    it('Should handle bid', async () => {
      let wrapper: ReactWrapper;

      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <UserAccountContext.Provider value={testAccount}>
                <MockedProvider mocks={mocks}>
                  <Elements stripe={stripePromise}>
                    <BidConfirmationModal {...props} />
                  </Elements>
                </MockedProvider>
              </UserAccountContext.Provider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });

      await act(async () => {
        wrapper.find(AsyncButton).prop('onClick')!(e);
        await new Promise((resolve) => setTimeout(resolve));
      });

      expect(mockFn).toHaveBeenCalled();
    });
  });
});
