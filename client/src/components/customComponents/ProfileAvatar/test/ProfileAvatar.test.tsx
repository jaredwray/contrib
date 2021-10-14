import { shallow, ShallowWrapper } from 'enzyme';

import { ProfileAvatar } from '../index';

describe('Should render correctly ProfileAvatar', () => {
  const props: any = {
    src: 'test',
  };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<ProfileAvatar {...props} />);
  });

  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
