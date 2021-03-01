import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import { AllInfluencersQuery } from 'src/apollo/queries/influencers';

import Influencers from '..';

const cache = new InMemoryCache();
cache.writeQuery({
  query: AllInfluencersQuery,
  data: {
    influencers: {
      size: 100,
      skip: 0,
      totalItems: 2,
      items: [],
    },
  },
});

test('renders without crashing', () => {
  render(
    <MockedProvider cache={cache}>
      <Influencers />
    </MockedProvider>,
  );
});
