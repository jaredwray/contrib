import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { CreateInfluencerModal } from '../CreateInfluencer';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  open: true,
  onclose: jest.fn(),
};

test('renders without crashing', () => {
  mount(
    <MockedProvider>
      <Router>
        <CreateInfluencerModal {...props} />
      </Router>
    </MockedProvider>,
  );
});
