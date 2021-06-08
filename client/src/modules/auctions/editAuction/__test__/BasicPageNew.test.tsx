import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';

import Edit from '../BasicPage/Edit';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Router>
        <ToastProvider>
          <MockedProvider>
            <Edit />
          </MockedProvider>
        </ToastProvider>
      </Router>,
    );
  });
});
