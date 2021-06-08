import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from 'enzyme';

import Filters from '../Filters';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  initialBids: {
    max: 2,
    min: 1,
  },
  filters: {
    sports: ['f1', 'soccer'],
    bids: {
      max: 4,
      min: 3,
    },
  },
  changeFilters: jest.fn(),
};

test('renders without crashing', () => {
  render(
    <MockedProvider>
      <Router>
        <Filters {...props} />
      </Router>
    </MockedProvider>,
  );
});
