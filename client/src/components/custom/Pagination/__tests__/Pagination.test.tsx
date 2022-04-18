import { shallow, ShallowWrapper } from 'enzyme';
import Pagination from 'src/components/custom/Pagination';

describe('Should render correctly "Pagination"', () => {
  const props: any = {
    loading: false,
    skip: 0,
    total: 50,
    showPrevPage: jest.fn(),
    showNextPage: jest.fn(),
  };
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<Pagination {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('it should call showPrevPage when click first button', () => {
    wrapper.find('Button').first().simulate('click');
    expect(props.showPrevPage).toHaveBeenCalledTimes(1);
  });
  it('it should call showNextPage when click last button', () => {
    wrapper.find('Button').last().simulate('click');
    expect(props.showNextPage).toHaveBeenCalledTimes(1);
  });
});
