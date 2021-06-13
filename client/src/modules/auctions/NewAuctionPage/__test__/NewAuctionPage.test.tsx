import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

import NewAuctionPage from '..';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(
    <Router>
      <NewAuctionPage />
    </Router>,
  );
});
