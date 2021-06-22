import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { AuctionQuery } from 'src/apollo/queries/auctions';

import AuctionPage from '../';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: AuctionQuery,
  data: {
    auction: {},
  },
});

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Router>
        <MockedProvider cache={cache}>
          <AuctionPage />
        </MockedProvider>
      </Router>,
    );
  });
});
