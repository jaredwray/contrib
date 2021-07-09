import { attachments } from '../../../../helpers/testHelpers/attachments';
import Dialog from '../MediaPage/Dialog';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

import { BrowserRouter as Router } from 'react-router-dom';

import { mount } from 'enzyme';

describe('Should render correctly "StopOrActiveButton"', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component returns null', () => {
    const props: any = {
      closeModal: jest.fn(),
    };
    const wrapper = mount(
      <Router>
        <Dialog {...props} />
      </Router>,
    );
    expect(wrapper.find('Modal')).toHaveLength(0);
  });
  it('component is defined', () => {
    const props: any = {
      selectedAttachment: attachments[0],
      closeModal: jest.fn(),
    };
    const wrapper = mount(
      <Router>
        <Dialog {...props} />
      </Router>,
    );
    expect(wrapper.find('Modal')).toHaveLength(2);
  });
});
