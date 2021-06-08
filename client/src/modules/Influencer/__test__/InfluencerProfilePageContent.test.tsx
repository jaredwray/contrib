import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuctionsListQuery } from 'src/apollo/queries/auctions';

import { InfluencerProfilePageContent } from '../InfluencerProfilePage/InfluencerProfilePageContent';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  influencer: {
    avatarUrl: 'test/avatarUrl',
  },
  totalRaisedAmount: {},
};

const cache = new InMemoryCache();
cache.writeQuery({
  query: AuctionsListQuery,
  data: {
    auctions: {},
  },
});

test('renders without crashing', () => {
  render(
    <Router>
      <MockedProvider cache={cache}>
        <InfluencerProfilePageContent {...props} />
      </MockedProvider>
    </Router>,
  );
});
