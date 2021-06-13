import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { AuctionQuery } from 'src/apollo/queries/auctions';

import AdminAuctionPage from '..';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: AuctionQuery,
  data: {
    auction: {},
  },
});

test('renders without crashing', () => {
  render(
    <Router>
      <ToastProvider>
        <MockedProvider cache={cache}>
          <AdminAuctionPage />
        </MockedProvider>
      </ToastProvider>
    </Router>,
  );
});
