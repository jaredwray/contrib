import { attachments } from 'src/helpers/testHelpers/attachments';
import AttachmentModal from 'src/components/AttachmentModal';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

import { BrowserRouter as Router } from 'react-router-dom';

import { mount } from 'enzyme';

describe('Should render correctly "Dialog"', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component returns null', () => {
    const props: any = {
      closeModal: jest.fn(),
    };
    const wrapper = mount(
      <Router>
        <AttachmentModal {...props} />
      </Router>,
    );
    expect(wrapper.find('Modal')).toHaveLength(0);
  });
  it('component is defined', () => {
    const props: any = {
      attachment: attachments[0],
      closeModal: jest.fn(),
    };
    const wrapper = mount(
      <Router>
        <AttachmentModal {...props} />
      </Router>,
    );
    expect(wrapper.find('Modal')).toHaveLength(2);
  });
});
