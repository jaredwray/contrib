import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

import Privacy from '..';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(
    <Router>
      <Privacy />
    </Router>,
  );
});
