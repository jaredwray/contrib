import Slider from '..';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import RSlider from 'react-slick';

describe('Should render correctly "Select"', () => {
  const props: any = { items: [] };
  const spy = jest.fn();
  beforeAll(() => {
    window.addEventListener('resize', spy);
  });
  it('component should return null', () => {
    const wrapper = mount(<Slider {...props} />);
    expect(wrapper.find('div')).toHaveLength(0);
  });
  it('component is defined and have RSlider ', () => {
    const newProps = { ...props, items: [<div key="1"></div>, <div key="2"></div>] };
    const wrapper = mount(<Slider {...newProps} />);
    window.innerWidth = 2048;

    expect(wrapper.find(RSlider)).toHaveLength(1);
  });
  it('updates the window width', () => {
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(spy).toHaveBeenCalled();
  });
});
