import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'enzyme';
import { attachments } from '../../../../helpers/testHelpers/attachments';
import AttachmentsSlider from '../AttachmentsSlider';
import { ReactWrapper, mount } from 'enzyme';
import Slider from 'react-slick';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  attachments,
};
const props2: any = {
  attachments: [],
};
describe('AttachmentsSlider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component should return null', () => {
    let wrapper: ReactWrapper;
    wrapper = mount(
      <Router>
        <AttachmentsSlider {...props2} />
      </Router>,
    );
    expect(wrapper.find(Slider)).toHaveLength(0);
  });
  it('renders without crashing', () => {
    let wrapper: ReactWrapper;
    wrapper = mount(
      <Router>
        <AttachmentsSlider {...props} />
      </Router>,
    );
    expect(wrapper).toHaveLength(1);
  });
  it('renders without crashing', () => {
    let wrapper: ReactWrapper;
    wrapper = mount(
      <Router>
        <AttachmentsSlider {...props} />
      </Router>,
    );
    wrapper.find(Slider).prop('beforeChange')!(1, 2);
    expect(wrapper.find("[data-test-id='attachment-id']")).toHaveLength(5);
    wrapper.find("[data-test-id='attachment-id']").first().simulate('click');
  });
});
