import { mount, ReactWrapper } from 'enzyme';
import { bids } from 'src/helpers/testHelpers/bids';
import { Modal } from '../Modal';

describe('Should render correctly "Modal"', () => {
  const props: any = {
    customerLoading: false,
    customerInformation: { email: 'test', phone: 'test' },
    bid: bids[0],
    loading: false,
    open: false,
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<Modal {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('component should return null', () => {
    wrapper.setProps({ ...props, customerInformation: null, customerLoading: true });
    expect(wrapper.children()).toHaveLength(0);
  });
});
