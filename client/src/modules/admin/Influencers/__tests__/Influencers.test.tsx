import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';

import { AllInfluencersQuery } from 'src/apollo/queries/influencers';

import Influencers from '..';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: AllInfluencersQuery,
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
            <Influencers />
          </MockedProvider>
        </ToastProvider>
      </Router>,
    );
  });
});
