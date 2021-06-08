import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { GetInfluencerQuery } from '../../../apollo/queries/influencers';
import { GetTotalRaisedAmount } from 'src/apollo/queries/auctions';

import { InfluencerProfilePage } from '../InfluencerProfilePage/InfluencerProfilePage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: GetInfluencerQuery,
  data: {
    influencer: {},
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
        <InfluencerProfilePage />
      </MockedProvider>
    </Router>,
  );
});
