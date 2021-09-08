import { shallow, ShallowWrapper } from 'enzyme';

import FirebaseInitializer from '..';

describe('Should render correctly "FirebaseInitializer"', () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<FirebaseInitializer />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
