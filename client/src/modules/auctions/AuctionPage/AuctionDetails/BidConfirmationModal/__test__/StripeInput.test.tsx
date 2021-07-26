import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { loadStripe } from '@stripe/stripe-js';
import { MemoryRouter } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';

import StripeInput from '../StripeInput';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? '');
describe('StripeInput ', () => {
  const props: any = {
    disabled: false,
    showCancelBtn: true,
    onChange: jest.fn(),
    onCancel: jest.fn(),
  };

  const mockedEvent = {
    target: {
      value: 'test',
    },
  } as any;

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <Elements stripe={stripePromise}>
          <StripeInput {...props} />
        </Elements>
      </MemoryRouter>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should change focus', () => {
    wrapper.find('div').first().simulate('click');
    wrapper.find('CardElement').props().onBlur!(mockedEvent);
    act(() => {
      wrapper.find('CardElement').props().onFocus!(mockedEvent);
    });
  });
});
