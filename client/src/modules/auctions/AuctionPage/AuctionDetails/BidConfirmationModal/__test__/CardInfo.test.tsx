import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';

import CardInfo from '../CardInfo';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  expired: true,
  isSubmitting: true,
  paymentInfo: {},
  onNewCardAdd: jest.fn(),
};

test('renders without crashing', () => {
  shallow(
    <Router>
      <CardInfo {...props} />
    </Router>,
  );
});
