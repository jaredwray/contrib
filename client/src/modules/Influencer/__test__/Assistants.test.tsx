import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { AssistantsQuery } from '../../../apollo/queries/assistants';

import Assistants from '../Assistants';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: AssistantsQuery,
  data: {
    influencer: {
      id: '123',
      name: 'test name',
      assistants: {
        id: '234',
        name: 'test assistant name',
        status: 'status',
      },
    },
  },
});

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Router>
        <MockedProvider cache={cache}>
          <Assistants />
        </MockedProvider>
      </Router>,
    );
  });
});
