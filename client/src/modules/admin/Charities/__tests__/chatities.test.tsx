import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';

import { AllCharitiesQuery } from 'src/apollo/queries/charities';

import CharitiesPage from '../';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: AllCharitiesQuery,
  data: {
    influencers: {
      size: 100,
      skip: 0,
      totalItems: 2,
      items: [],
    },
  },
});

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Router>
        <ToastProvider>
          <MockedProvider cache={cache}>
            <CharitiesPage />
          </MockedProvider>
        </ToastProvider>
      </Router>,
    );
  });
});
