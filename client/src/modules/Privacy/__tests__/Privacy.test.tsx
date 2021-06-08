import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';

import Privacy from '..';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  shallow(
    <Router>
      <Privacy />
    </Router>,
  );
});
