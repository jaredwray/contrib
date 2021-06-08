import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import { FairMarketValueChangeButton } from '../FairMarketValueChangeButton';
import { auction } from '../../../../helpers/testHelpers/auction';

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
  render(
    <MockedProvider>
      <Router>
        <FairMarketValueChangeButton {...props} />
      </Router>
    </MockedProvider>,
  );
});
