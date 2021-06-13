import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { attachments } from '../../../../helpers/testHelpers/attachments';
import Dialog from '../MediaPage/Dialog';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  selectedAttachment: attachments[0],
  closeModal: jest.fn(),
};

test('renders without crashing', () => {
  render(
    <Router>
      <Dialog {...props} />
    </Router>,
  );
});
