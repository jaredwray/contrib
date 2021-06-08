import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';

import AuctionsPage from '..';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: AuctionsListQuery,
  data: {
    auctions: {
      size: 100,
      skip: 0,
      totalItems: 2,
      items: [],
    },
  },
});

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Router>
        <MockedProvider cache={cache}>
          <AuctionsPage />
        </MockedProvider>
      </Router>,
    );
  });
});
