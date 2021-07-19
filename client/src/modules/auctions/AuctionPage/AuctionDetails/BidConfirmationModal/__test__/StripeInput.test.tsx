import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeInput from '../StripeInput';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? '');
describe('StripeInput ', () => {
  const props: any = {
    disabled: false,
    showCancelBtn: true,
    onChange: jest.fn(),
    onCancel: jest.fn(),
  };
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
  });
});
