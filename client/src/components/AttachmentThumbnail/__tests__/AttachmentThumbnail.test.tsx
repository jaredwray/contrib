import { mount, shallow } from 'enzyme';

import AttachmentThumbnail from '..';

describe('Should render correctly "AttachmentThumbnail"', () => {
  const props: any = {
    attachment: { thumbnail: 'test', type: 'VIDEO', url: 'test' },
    className: 'test',
  };

  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<AttachmentThumbnail {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
