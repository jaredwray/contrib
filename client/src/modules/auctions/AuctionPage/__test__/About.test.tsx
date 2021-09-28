import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import About from '../About';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  description: 'test',
};

test('renders without crashing', () => {
  render(
    <Router>
      <About {...props} />
    </Router>,
  );
});
