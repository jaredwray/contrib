import { mount, ReactWrapper } from 'enzyme';

import IntercomStateManager from '../index';

describe('Should render correctly "IntercomStateManager"', () => {
  global.Intercom = jest.fn();
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<IntercomStateManager />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
