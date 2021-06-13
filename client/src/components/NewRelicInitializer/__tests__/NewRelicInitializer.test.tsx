import { mount } from 'enzyme';

import NewRelicInitializer from 'src/components/NewRelicInitializer';

describe('Should render correctly "NewRelicInitializer"', () => {
  let wrapper: any;
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