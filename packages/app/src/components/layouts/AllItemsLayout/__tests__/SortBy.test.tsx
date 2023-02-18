import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';

import Select from 'src/components/forms/selects/Select';

import SortBy from '../SortBy';

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
    act(() => {
      wrapper.find(Select).props().onChange('NAME_ASC');
      expect(props.changeFilters).toBeCalledTimes(1);
    });
  });
});
