import Nouislider from 'nouislider-react';
import { mount } from 'enzyme';

import PriceRange from '../Filters/PriceRange';

describe('PriceRange', () => {
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

  describe('without bids', () => {
    it('returns null', () => {
      const wrapper = mount(<PriceRange {...{ ...props, initialBids: null }} />);
      wrapper.setProps({});
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });
  describe('with bids', () => {
    it('returns filters', () => {
      const wrapper = mount(<PriceRange {...props} />);
      expect(wrapper.isEmptyRender()).toBe(false);
    });
  });
  it('calls changeFilters onChange', () => {
    const wrapper = mount(<PriceRange {...props} />);
    wrapper.find(Nouislider).prop('onChange')!(['1', '2'], 1, [], true, []);
    expect(props.changeFilters).toHaveBeenCalledTimes(1);
  });
});
