import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { GetCharity } from 'src/apollo/queries/charityProfile';

import { CharityProfileEditPage } from '../CharityProfileEditPage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: GetCharity,
  data: {
    id: '123',
    name: 'test name',
    status: 'STATUS',
    avatarUrl: 'test/url',
    profileDescription: 'test description',
    websiteUrl: 'test/websiteurl',
    website: 'testWebsite',
  },
});

test('renders without crashing', () => {
  render(
    <Router>
      <ToastProvider>
        <MockedProvider cache={cache}>
          <CharityProfileEditPage />
        </MockedProvider>
      </ToastProvider>
    </Router>,
  );
});
