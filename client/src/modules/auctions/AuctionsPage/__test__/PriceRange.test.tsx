import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import PriceRange from '../Filters/PriceRange';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  initialBids: {
    max: 2,
    min: 1,
  },
  bids: {
    max: 4,
    min: 3,
  },
  changeFilters: jest.fn(),
};

test('renders without crashing', () => {
  render(
    <Router>
      <PriceRange {...props} />
    </Router>,
  );
});
