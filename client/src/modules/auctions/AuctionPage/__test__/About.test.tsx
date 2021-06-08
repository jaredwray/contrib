import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import About from '../About';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  fullPageDescription: 'test',
  autographed: true,
  authenticityCertificate: true,
  gameWorn: true,
};

test('renders without crashing', () => {
  render(
    <Router>
      <About {...props} />
    </Router>,
  );
});
