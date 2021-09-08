import SortBy from '../SortBy';
import { ReactWrapper, mount } from 'enzyme';
import Select from 'src/components/Select';

describe('Should render correctly "SortBy"', () => {
  const props: any = {
    changeFilters: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<SortBy {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call changeFilters when changing', () => {
    wrapper.find(Select).props().onChange('TIME_ASC');
    expect(props.changeFilters).toBeCalledTimes(1);
  });
});
