import FilePreview from '../FilePreview';
import { mount, ReactWrapper } from 'enzyme';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

global.URL.createObjectURL = jest.fn(() => 'www.test');

const props: any = {
  file: {
    lastModified: 1,
    lastModifiedDate: new Date(),
    name: 'test.jpg',
    path: 'test.jpg',
    size: 1,
    type: 'image/jpeg',
    webkitRelativePath: '',
  },
};
describe('AuctionPage ', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<FilePreview {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined and has img', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('img')).toHaveLength(1);
  });
  it('component is defined and has video', () => {
    wrapper.setProps({ file: { ...props.file, type: 'video/mp4' } });
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('video')).toHaveLength(1);
    wrapper.find('video').simulate('click');
  });
});
