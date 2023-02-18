// yarn test src/modules/UserProfile/__test__/PaymentInformation.test.tsx
import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { MockedProvider } from '@apollo/client/testing';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { ToastProvider } from 'react-toast-notifications';
import { Button } from 'react-bootstrap';

import { testAccount } from 'src/helpers/testHelpers/account';
import { RegisterPaymentMethodMutation } from 'src/apollo/queries/bidding';
import { CardInput } from 'src/components/forms/inputs/CardInput';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

import PaymentInformation from '../PaymentInformation';

const mockElement = () => ({
  mount: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  update: jest.fn(),
});
let mockElements;

mockElements = () => {
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
  // createToken: jest.fn(),
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

const props = {
  account: testAccount,
};

const mocks = [
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

describe('PaymentInformation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const e: any = Event;

  it('renders without crashing', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider>
            <Elements stripe={stripePromise}>
              <PaymentInformation {...props} />
            </Elements>
          </MockedProvider>
        </ToastProvider>,
      );
    });

    expect(wrapper!).toHaveLength(1);

    const CardInputProps = wrapper.find(CardInput).props();
    act(() => {
      CardInputProps.handleAddCard();
      CardInputProps.onChange('1234');
      CardInputProps.onSave();
      CardInputProps.handleAddCard();
      CardInputProps.onCancel();
    });
  });

  describe('when new card adding', () => {
    it('renders without crashing', async () => {
      let wrapper: ReactWrapper;

      await act(async () => {
        wrapper = mount(
          <ToastProvider>
            <MockedProvider>
              <Elements stripe={stripePromise}>
                <PaymentInformation {...props} />
              </Elements>
            </MockedProvider>
          </ToastProvider>,
        );
      });

      const CardInputProps = wrapper.find(CardInput).props();
      act(() => {
        CardInputProps.handleAddCard();
        CardInputProps.onChange('1234');
        CardInputProps.onSave();
        CardInputProps.handleAddCard();
        CardInputProps.onCancel();
      });
    });
  });
});
