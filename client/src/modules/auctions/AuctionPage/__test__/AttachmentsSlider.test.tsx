import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';
import { attachments } from '../../../../helpers/testHelpers/attachments';
import AttachmentsSlider from '../AttachmentsSlider';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  attachments,
};

test('renders without crashing', () => {
  render(
    <Router>
      <AttachmentsSlider {...props} />
    </Router>,
  );
});
