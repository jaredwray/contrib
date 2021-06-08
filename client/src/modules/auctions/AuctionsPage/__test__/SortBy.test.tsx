import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import SortBy from '../SortBy';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  changeFilters: jest.fn(),
};

test('renders without crashing', () => {
  render(
    <Router>
      <SortBy {...props} />
    </Router>,
  );
});
