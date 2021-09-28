import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import Status from '../About/Status';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  value: true,
  text: 'test',
};

test('renders without crashing', () => {
  render(
    <Router>
      <Status {...props} />
    </Router>,
  );
});
