import Dinero from 'dinero.js';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { BidInput } from '../BidInput';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  minBid: Dinero({ amount: 1, currency: 'USD' }),
  onSubmit: jest.fn(),
  fairMarketValue: Dinero({ amount: 3, currency: 'USD' }),
};

test('renders without crashing', () => {
  render(
    <Router>
      <BidInput {...props} />
    </Router>,
  );
});
