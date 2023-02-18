import { shallow, ShallowWrapper } from 'enzyme';

import InternalScripts from '..';

describe('Should render correctly "InternalScripts"', () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<InternalScripts />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
