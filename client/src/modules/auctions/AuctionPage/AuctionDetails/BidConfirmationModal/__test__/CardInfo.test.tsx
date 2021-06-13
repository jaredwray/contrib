import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

import CardInfo from '../CardInfo';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  expired: true,
  isSubmitting: true,
  paymentInfo: {},
  onNewCardAdd: jest.fn(),
};

test('renders without crashing', () => {
  render(
    <Router>
      <CardInfo {...props} />
    </Router>,
  );
});
