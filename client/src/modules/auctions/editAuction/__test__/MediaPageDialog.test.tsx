import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import { attachments } from '../../../../helpers/testHelpers/attachments';
import Dialog from '../MediaPage/Dialog';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  selectedAttachment: attachments[0],
  closeModal: jest.fn(),
};

test('renders without crashing', () => {
  shallow(
    <Router>
      <Dialog {...props} />
    </Router>,
  );
});
