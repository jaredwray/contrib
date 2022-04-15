import { mount, ReactWrapper } from 'enzyme';

import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { TotalRaisedAmountQuery } from 'src/apollo/queries/auctions';
import { TopEarnedInfluencerQuery } from 'src/apollo/queries/influencers';
import { TopCharityQuery } from 'src/apollo/queries/charities';

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
      id: 1,
      totalRaisedAmount: { amount: 100 },
      name: 'test',
      avatarUrl: '/',
    },
  },
});
cacheWithItems.writeQuery({
  query: TopCharityQuery,
  data: {
    topCharity: {
      id: 2,
      semanticId: 'test',
      totalRaisedAmount: { amount: 100 },
      name: 'test',
      avatarUrl: '/',
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
cacheWithoutItems.writeQuery({
  query: TopCharityQuery,
  data: {
    topCharity: null,
  },
});

describe('Badges', () => {
  describe('with data', () => {
    it('renders TotalAmount', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <MockedProvider cache={cacheWithItems}>
              <Badges />
            </MockedProvider>
          </MemoryRouter>,
        );
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(TotalAmount)).toHaveLength(3);
    });
  });

  describe('without data', () => {
    it('renders default TotalAmount', async () => {
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
      expect(wrapper!.find(TotalAmount)).toHaveLength(3);
    });
  });
});
