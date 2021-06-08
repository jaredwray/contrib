import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';

import PriceRange from '../Filters/PriceRange';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  selectedSports: ['soccer', 'f1'],
  changeFilters: jest.fn(),
};

test('renders without crashing', () => {
  render(
    <Router>
      <PriceRange {...props} />
    </Router>,
  );
});
