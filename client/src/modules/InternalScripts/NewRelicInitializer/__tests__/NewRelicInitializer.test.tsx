import { mount, ReactWrapper } from 'enzyme';

import NewRelicInitializer from '../index';

describe('Should render correctly "NewRelicInitializer"', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<NewRelicInitializer />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
