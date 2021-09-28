import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

import AdminDropdown from '../InfluencerProfilePage/AdminDropdown';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(
    <Router>
      <AdminDropdown />
    </Router>,
  );
});
