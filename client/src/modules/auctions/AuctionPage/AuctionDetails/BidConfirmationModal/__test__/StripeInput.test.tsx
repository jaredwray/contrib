import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import StripeInput from '../StripeInput';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  disabled: false,
  showCancelBtn: true,
  onChange: jest.fn(),
  onCancel: jest.fn(),
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? '');

test('renders without crashing', () => {
  render(
    <Router>
      <Elements stripe={stripePromise}>
        <StripeInput {...props} />
      </Elements>
    </Router>,
  );
});
