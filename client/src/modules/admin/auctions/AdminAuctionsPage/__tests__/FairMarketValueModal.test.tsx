import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { mount } from 'enzyme';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import { Modal } from '../FairMarketValueChangeButton/Modal';
import { auction } from 'src/helpers/testHelpers/auction';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  open: true,
  onClose: jest.fn(),
  auction,
  mutation: gql`
    mutation test($name: String!) {
      test(name: $name) {
        name
      }
    }
  `,
};

test('renders without crashing', () => {
  mount(
    <ToastProvider>
      <MockedProvider>
        <Router>
          <Modal {...props} />
        </Router>
      </MockedProvider>
    </ToastProvider>,
  );
});
