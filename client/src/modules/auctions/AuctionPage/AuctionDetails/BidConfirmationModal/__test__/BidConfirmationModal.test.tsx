import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { BidConfirmationModal } from '../BidConfirmationModal';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  auctionId: '123',
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? '');

test('renders without crashing', () => {
  render(
    <Router>
      <ToastProvider>
        <MockedProvider>
          <Elements stripe={stripePromise}>
            <BidConfirmationModal {...props} />
          </Elements>
        </MockedProvider>
      </ToastProvider>
    </Router>,
  );
});
