import { mount, ReactWrapper } from 'enzyme';
import { DeliveryTextBlock } from 'src/components/DeliveryTextBlock';

describe('Should render correctly "DialogActions "', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<DeliveryTextBlock />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
