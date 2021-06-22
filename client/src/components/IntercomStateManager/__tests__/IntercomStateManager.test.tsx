import { mount, ReactWrapper } from 'enzyme';

import IntercomStateManager from 'src/components/IntercomStateManager';

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
