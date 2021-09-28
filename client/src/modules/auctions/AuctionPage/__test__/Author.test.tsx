import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import Author from '../Author';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  id: '123',
  name: 'test',
  avatarUrl: '/test/url',
};

test('renders without crashing', () => {
  render(
    <Router>
      <Author {...props} />
    </Router>,
  );
});
