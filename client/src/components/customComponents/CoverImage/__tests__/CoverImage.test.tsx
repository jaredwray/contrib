import { shallow, ShallowWrapper } from 'enzyme';

import CoverImage from 'src/components/customComponents/CoverImage';

describe('Should render correctly "CoverImage"', () => {
  const props: any = {
    src: 'test',
    alt: 'test',
  };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<CoverImage {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
