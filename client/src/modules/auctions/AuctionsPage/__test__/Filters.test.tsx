import Filters from '../Filters';
import { ReactWrapper, mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import SearchInput from 'src/components/SearchInput';

describe('Should render correctly "Filters"', () => {
  const props: any = {
    initialBids: {
      maxPrice: 5,
      minPrice: 1,
    },
    filters: {
      sports: ['f1', 'soccer'],
      bids: {
        maxPrice: 10,
        minPrice: 1,
      },
      status: ['ACTIVE'],
      charity: [],
    },
    changeFilters: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider>
        <Filters {...props} />
      </MockedProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call changeFilters', () => {
    wrapper.find(SearchInput).props().onChange('test');
    wrapper
      .find(SearchInput)
      .children()
      .find('input')
      .simulate('change', { target: { value: 'test' } });
    wrapper.find(SearchInput).children().find('Button').simulate('click');
    expect(props.changeFilters).toHaveBeenCalledTimes(3);
  });
});
