import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { mount } from 'enzyme';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import { StopOrActiveButton } from '../StopOrActiveButton';
import { auction } from 'src/helpers/testHelpers/auction';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  auction,
  mutation: gql`
    mutation test($name: String!) {
      test(name: $name) {
        name
      }
    }
  `,
  className: jest.fn(),
};

test('renders without crashing', () => {
  mount(
    <ToastProvider>
      <MockedProvider>
        <Router>
          <StopOrActiveButton {...props} />
        </Router>
      </MockedProvider>
    </ToastProvider>,
  );
});
