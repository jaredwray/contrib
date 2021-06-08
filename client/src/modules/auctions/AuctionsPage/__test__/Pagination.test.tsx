import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import Pagination from '../Pagination';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  totalItems: 1,
  pageSize: 2,
  pageSkip: 3,
  perPage: 4,
  changeFilters: jest.fn(),
};

test('renders without crashing', () => {
  render(
    <Router>
      <Pagination {...props} />
    </Router>,
  );
});
