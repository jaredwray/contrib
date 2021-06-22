import { shallow, ShallowWrapper } from 'enzyme';

import { AdminPage } from '..';
describe('Should render correctly "AttachmentThumbnail"', () => {
  const props: any = {
    items: [{}, {}],
    pageSkip: 20,
    setPageSkip: jest.fn(),
    loading: false,
  };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<AdminPage {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
