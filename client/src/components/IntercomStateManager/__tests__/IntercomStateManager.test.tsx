import { mount } from 'enzyme';

import IntercomStateManager from 'src/components/IntercomStateManager';

describe('Should render correctly "IntercomStateManager"', () => {
  global.Intercom = jest.fn();
  let wrapper: any;
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
