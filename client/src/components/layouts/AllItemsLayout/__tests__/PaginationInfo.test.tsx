import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import PaginationInfo from '../PaginationInfo';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  totalItems: 1,
  pageSize: 2,
  pageSkip: 3,
  perPage: 4,
};

test('renders without crashing', () => {
  render(
    <Router>
      <PaginationInfo {...props} />
    </Router>,
  );
});
