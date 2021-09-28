import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import LinesEllipsis from 'react-lines-ellipsis';

import { ReadMore } from '../index';

describe('Should render correctly "ReadMore"', () => {
  const props: any = {
    text: 'test text',
  };
  const props2: any = {
    text: '',
  };

  beforeEach(() => {});
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('components is defines and has text "no description"', () => {
    const wrapper: ReactWrapper = mount(<ReadMore {...props2} />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.text()).toEqual('no description');
  });
  it('component is defined and has "test text" text', () => {
    const wrapper: ReactWrapper = mount(<ReadMore {...props} />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.text()).toEqual('test text');
  });
  it('component is defined and has "read more" button', () => {
    const wrapper: ReactWrapper = mount(<ReadMore {...props} />);

    act(() => {
      wrapper.find(LinesEllipsis).prop('onReflow')!({ clamped: true, text: 'test text' });
    });
    wrapper.update();
    expect(wrapper.find("[data-test-id='read_more_btn']")).toHaveLength(1);
    act(() => {
      wrapper.find("[data-test-id='read_more_btn']").simulate('click');
    });
  });
});
