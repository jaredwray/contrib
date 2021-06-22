import { shallow, ShallowWrapper } from 'enzyme';
import { CloseButton } from 'src/components/CloseButton';

describe('Should render correctly "CloseButton"', () => {
  const props: any = {
    action: jest.fn(),
  };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<CloseButton {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
