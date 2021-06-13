import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { GetCharity } from 'src/apollo/queries/charityProfile';
import { GetTotalRaisedAmount } from 'src/apollo/queries/auctions';

import { CharityProfilePage } from '../CharityProfilePage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: GetCharity,
  data: {
    charity: {},
  },
});

cache.writeQuery({
  query: GetTotalRaisedAmount,
  data: {
    getTotalRaisedAmount: {},
  },
});

test('renders without crashing', () => {
  render(
    <Router>
      <MockedProvider cache={cache}>
        <CharityProfilePage />
      </MockedProvider>
    </Router>,
  );
});
