import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import { getAuctionBasics } from 'src/apollo/queries/auctions';

import Edit from '../BasicPage/Edit';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: getAuctionBasics,
  data: {
    auction: {
      id: '123',
      title: 'test title',
      sport: 'soccer',
      gameWorn: true,
      link: 'test/link',
      autographed: true,
      authenticityCertificate: true,
      playedIn: true,
      description: 'test description',
      fullPageDescription: 'test fullPageDescription',
    },
  },
});

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Router>
        <ToastProvider>
          <MockedProvider cache={cache}>
            <Edit />
          </MockedProvider>
        </ToastProvider>
      </Router>,
    );
  });
});
