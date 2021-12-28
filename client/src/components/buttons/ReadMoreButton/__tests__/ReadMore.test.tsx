import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import LinesEllipsis from 'react-lines-ellipsis';

import { ReadMore } from '../index';

describe('ReadMore', () => {
  describe('when text is blank', () => {
    it('returns "no description"', () => {
      const wrapper: ReactWrapper = mount(<ReadMore text="" />);
      expect(wrapper).toHaveLength(1);
      expect(wrapper.text()).toEqual('no description');
    });
  });

  describe('when text is null', () => {
    it('returns "no description"', () => {
      const wrapper: ReactWrapper = mount(<ReadMore text={null} />);
      expect(wrapper).toHaveLength(1);
      expect(wrapper.text()).toEqual('no description');
    });
  });

  describe('when text is short', () => {
    it('returns passed text without "read more" button', () => {
      const wrapper: ReactWrapper = mount(<ReadMore text="test text" />);
      expect(wrapper).toHaveLength(1);
      expect(wrapper.text()).toEqual('test text');
      expect(wrapper.find("[data-test-id='read_more_btn']")).toHaveLength(0);
    });
  });

  describe('when text is too long', () => {
    it('returns clamped text with "read more" button', () => {
      const text = 'test\
        text'.repeat(9);
      const wrapper: ReactWrapper = mount(<ReadMore text={text} />);

      act(() => {
        wrapper.find(LinesEllipsis).prop('onReflow')!({ clamped: true, text: text });
      });

      wrapper.update();

      expect(wrapper.find("[data-test-id='read_more_btn']")).toHaveLength(1);
      act(() => {
        wrapper.find("[data-test-id='read_more_btn']").simulate('click');
      });
    });
  });
});
