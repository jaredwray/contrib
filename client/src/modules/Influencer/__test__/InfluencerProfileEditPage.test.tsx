import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { InfluencerProfileQuery } from '../../../apollo/queries/profile';

import { InfluencerProfileEditPage } from '../InfluencerProfileEditPage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: InfluencerProfileQuery,
  data: {
    influencer: {
      id: '123',
      profileDescription: 'test',
      name: 'test name',
      sport: 'soccer',
      team: 'MU',
      avatarUrl: 'test/avatarUrl',
      status: 'status',
      favoriteCharities: {
        id: '234',
        name: 'test name',
      },
    },
  },
});

test('renders without crashing', () => {
  render(
    <Router>
      <ToastProvider>
        <MockedProvider cache={cache}>
          <InfluencerProfileEditPage />
        </MockedProvider>
      </ToastProvider>
    </Router>,
  );
});
