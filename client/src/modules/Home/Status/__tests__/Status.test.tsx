import { mount, ReactWrapper } from 'enzyme';

import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { act } from 'react-dom/test-utils';
import { TotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { TopEarnedInfluencerQuery } from 'src/apollo/queries/influencers';

import Status from '..';
const cacheWithoutItems = new InMemoryCache();

cacheWithoutItems.writeQuery({
  query: TotalRaisedAmountQuery,
  data: { totalRaisedAmount: 0 },
});
cacheWithoutItems.writeQuery({
  query: TopEarnedInfluencerQuery,
  data: {
    topEarnedInfluencer: null,
  },
});

describe('Status', () => {
  it('renders without crashing', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider cache={cacheWithoutItems}>
          <Status />
        </MockedProvider>,
      );
    });
    expect(wrapper!).toHaveLength(1);
  });
});
