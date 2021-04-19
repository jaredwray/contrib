import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import WelcomePage from '..';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(
    <Router>
      <WelcomePage />
    </Router>,
  );
});
