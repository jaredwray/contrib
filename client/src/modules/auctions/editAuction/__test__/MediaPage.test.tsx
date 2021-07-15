import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import { GetAuctionMediaQuery } from 'src/apollo/queries/auctions';

import MediaPage from '../MediaPage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: GetAuctionMediaQuery,
  data: {
    auction: {
      attachments: [],
    },
  },
});

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Router>
        <ToastProvider>
          <MockedProvider cache={cache}>
            <MediaPage />
          </MockedProvider>
        </ToastProvider>
      </Router>,
    );
  });
});
