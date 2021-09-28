import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';

import StepByStepPageLayout from '..';

test('renders without crashing', () => {
  const props = {
    loading: false,
    progress: 99,
    step: '1',
    title: 'test',
    header: 'header',
  };
  render(
    <ToastProvider>
      <MockedProvider>
        <Router>
          <StepByStepPageLayout {...props} />
        </Router>
      </MockedProvider>
    </ToastProvider>,
  );
});
