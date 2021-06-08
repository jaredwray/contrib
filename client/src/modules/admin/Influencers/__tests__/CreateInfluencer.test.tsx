import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { CreateInfluencer } from '../CreateInfluencer';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(
    <MockedProvider>
      <Router>
        <CreateInfluencer />
      </Router>
    </MockedProvider>,
  );
});
