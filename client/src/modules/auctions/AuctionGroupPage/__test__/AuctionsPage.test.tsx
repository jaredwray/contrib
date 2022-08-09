import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';

import { auction } from 'src/helpers/testHelpers/auction';
import { AuctionPriceLimitsQuery, AuctionsListQuery } from 'src/apollo/queries/auctions';

import AuctionsPage from '..';
import Filters from '../Filters';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: AuctionsListQuery,
  variables: {
    size: 20,
    skip: 0,
    query: '',
    orderBy: 'CREATED_AT_DESC',
    filters: {
      charity: [],
      maxPrice: 99999900,
      minPrice: 10000,
    },
    statusFilter: ['ACTIVE', 'SETTLED', 'SOLD'],
  },
  data: {
    auctions: {
      size: 100,
      skip: 0,
      totalItems: 2,
      items: [auction],
    },
  },
});

cache.writeQuery({
  query: AuctionPriceLimitsQuery,
  variables: {
    query: '',
    filters: {
      charity: [],
    },
    statusFilter: ['ACTIVE', 'SETTLED', 'SOLD'],
  },
  data: {
    auctionPriceLimits: {
      max: { amount: 99999900, currency: 'USD', precision: 2 },
      min: { amount: 10000, currency: 'USD', precision: 2 },
    },
  },
});

test('renders without crashing', async () => {
  let wrapper: ReactWrapper;
  await act(async () => {
    wrapper = mount(
      <ToastProvider>
        <Router>
          <MockedProvider cache={cache}>
            <AuctionsPage />
          </MockedProvider>
        </Router>
      </ToastProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve));
    wrapper.update();

    wrapper.find(Filters).props().charityChangeFilter('bids', ['test']);
  });
});
