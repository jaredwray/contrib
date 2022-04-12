import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Banner from '../Banner';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(
    <MockedProvider>
      <Router>
        <Banner />
      </Router>
    </MockedProvider>,
  );
});
