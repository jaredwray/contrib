import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

import CardInfo from '../CardInfo';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

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
test('component should return null', () => {
  const props: any = {
    expired: true,
    isSubmitting: true,
    onNewCardAdd: jest.fn(),
  };
  render(
    <Router>
      <CardInfo {...props} />
    </Router>,
  );
});
