import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

import Terms from '..';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(
    <Router>
      <Terms />
    </Router>,
  );
});
