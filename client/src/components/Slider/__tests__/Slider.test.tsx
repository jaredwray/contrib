import Slider from '..';
import { mount, ReactWrapper } from 'enzyme';
import RSlider from 'react-slick';

describe('Should render correctly "Select"', () => {
  const props: any = { items: [] };

  it('component should return null', () => {
    const wrapper = mount(<Slider {...props} />);
    expect(wrapper.find('div')).toHaveLength(0);
  });
  it('component is defined and have RSlider ', () => {
    const newProps = { ...props, items: [<div key="1"></div>] };
    const wrapper = mount(<Slider {...newProps} />);
    expect(wrapper.find(RSlider)).toHaveLength(1);
  });
});
