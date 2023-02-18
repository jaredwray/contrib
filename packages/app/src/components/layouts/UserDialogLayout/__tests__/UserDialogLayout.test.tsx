import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';

import { UserDialogLayout } from '..';

test('renders without crashing', () => {
  const props = {
    title: 'test',
    textBlock: <>Test</>,
  };
  render(
    <ToastProvider>
      <MockedProvider>
        <Router>
          <UserDialogLayout {...props} />
        </Router>
      </MockedProvider>
    </ToastProvider>,
  );
});
