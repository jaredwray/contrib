import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import Benefits from '../Benefits';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  id: '123',
  name: 'test',
  avatarUrl: '/test/url',
  status: 'status',
};

test('renders without crashing', () => {
  render(
    <Router>
      <Benefits {...props} />
    </Router>,
  );
});
