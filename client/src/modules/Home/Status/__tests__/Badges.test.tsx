import { mount, ReactWrapper } from 'enzyme';

import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { act } from 'react-dom/test-utils';
import { TotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { TopEarnedInfluencerQuery } from 'src/apollo/queries/influencers';

import { Badges } from '../Badges';
import { TotalAmount } from '../Badges/TotalAmount';

const cacheWithItems = new InMemoryCache();
const cacheWithoutItems = new InMemoryCache();

cacheWithItems.writeQuery({
  query: TotalRaisedAmountQuery,
  data: { totalRaisedAmount: 100 },
});
cacheWithItems.writeQuery({
  query: TopEarnedInfluencerQuery,
  data: {
    topEarnedInfluencer: {
      totalRaisedAmount: { amount: 100 },
      name: 'test',
    },
  },
});
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

describe('Badges', () => {
  describe('with data', () => {
    it('renders TotalAmount', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MockedProvider cache={cacheWithItems}>
            <Badges />
          </MockedProvider>,
        );
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(TotalAmount)).toHaveLength(2);
    });
  });

  describe('without data', () => {
    it('does not render TotalAmount', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MockedProvider cache={cacheWithoutItems}>
            <Badges />
          </MockedProvider>,
        );
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(TotalAmount)).toHaveLength(0);
    });
  });
});
