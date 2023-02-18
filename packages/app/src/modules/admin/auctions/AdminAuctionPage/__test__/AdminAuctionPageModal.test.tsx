import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';

import { Modal } from '../Modal';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  bid: { user: {} },
  isBid: true,
  loading: true,
  open: true,
  onConfirm: jest.fn(),
  onClose: jest.fn(),
};

test('renders without crashing', () => {
  mount(
    <Router>
      <Modal {...props} />
    </Router>,
  );
});
