import { mount, shallow, ShallowWrapper } from 'enzyme';

import { CharitiesFormFields } from '..';

describe('Should render correctly "AttachmentThumbnail"', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<CharitiesFormFields />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
