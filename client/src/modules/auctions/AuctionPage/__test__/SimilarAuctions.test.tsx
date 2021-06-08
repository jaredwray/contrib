import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';

import SimilarAuctions from '../SimilarAuctions';

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

test('renders without crashing', () => {
  render(
    <Router>
      <MockedProvider cache={cache}>
        <SimilarAuctions />
      </MockedProvider>
    </Router>,
  );
});
