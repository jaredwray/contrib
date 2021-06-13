import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { shallow } from 'enzyme';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import { FairMarketValueChangeButton } from '../FairMarketValueChangeButton';
import { auction } from '../../../../../helpers/testHelpers/auction';

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
  shallow(
    <ToastProvider>
      <MockedProvider>
        <Router>
          <FairMarketValueChangeButton {...props} />
        </Router>
      </MockedProvider>
    </ToastProvider>,
  );
});
