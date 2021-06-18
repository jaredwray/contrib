import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { DineroObject } from 'dinero.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { AuctionsListQuery } from 'src/apollo/queries/auctions';

import { CharityProfilePageContent } from '../CharityProfilePageContent';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  charity: {},
  totalRaisedAmount: {} as DineroObject,
};

const cache = new InMemoryCache();
cache.writeQuery({
  query: AuctionsListQuery,
  data: {
    totalItems: 40,
    size: 10,
    skip: 0,
    items: [],
  },
});

test('renders without crashing', () => {
  render(
    <Router>
      <MockedProvider cache={cache}>
        <ToastProvider>
          <CharityProfilePageContent {...props} />
        </ToastProvider>
      </MockedProvider>
    </Router>,
  );
});
