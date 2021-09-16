import Nouislider from 'nouislider-react';
import { mount } from 'enzyme';

import PriceRange from '../Filters/PriceRange';

describe('Should render correctly "Filters"', () => {
  const props: any = {
    initialBids: {
      maxPrice: 5,
      minPrice: 1,
    },
    bids: {
      maxPrice: 10,
      minPrice: 1,
    },
    changeFilters: jest.fn(),
  };

  it('component returns null', () => {
    const wrapper = mount(<PriceRange {...{ ...props, initialBids: null }} />);
    wrapper.setProps({});
    expect(wrapper.find('.form-group')).toHaveLength(0);
  });
  it('component is defined', () => {
    const wrapper = mount(<PriceRange {...props} />);
    expect(wrapper.find('.form-group')).toHaveLength(1);
  });
  it('should call changeFilters when changing', () => {
    const wrapper = mount(<PriceRange {...props} />);
    wrapper.find(Nouislider).prop('onChange')!(['1', '2'], 1, [], true, []);
    expect(props.changeFilters).toHaveBeenCalledTimes(1);
  });
});
