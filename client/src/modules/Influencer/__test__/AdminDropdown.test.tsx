import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';

import AdminDropdown from '../InfluencerProfilePage/AdminDropdown';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  shallow(
    <Router>
      <AdminDropdown />
    </Router>,
  );
});
