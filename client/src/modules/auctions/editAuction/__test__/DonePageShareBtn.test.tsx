import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import ShareButton from '../DonePage/ShareButton';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  service: 'test service',
  icon: [],
  href: 'test/href',
  onClick: jest.fn(),
};

test('renders without crashing', () => {
  render(
    <Router>
      <ShareButton {...props} />
    </Router>,
  );
});
