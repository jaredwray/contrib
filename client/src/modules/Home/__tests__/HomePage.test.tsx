import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import { BrowserRouter as Router } from 'react-router-dom';

import HomePage from '..';

const cache = new InMemoryCache();
cache.writeQuery({
  query: AuctionsListQuery,
  variables: { size: 10, skip: 0 },
  data: [],
});

test('renders without crashing', () => {
  render(
    <MockedProvider cache={cache}>
      <Router>
        <HomePage />
      </Router>
    </MockedProvider>,
  );
});
