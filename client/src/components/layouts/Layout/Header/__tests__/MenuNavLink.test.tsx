import { mount, ReactWrapper } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import MenuNavLink from '../Menu/MenuNavLink';
const props: any = {
  link: '/',
  title: 'test',
};

describe('MenuNavLink', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <MenuNavLink {...props} />
      </Router>,
    );
  });

  it('renders component', () => {
    expect(wrapper).toHaveLength(1);
  });

  describe('on NavLink click', () => {
    const mockClick = jest.fn();
    document.body.click = mockClick;

    it('calls document.body', () => {
      wrapper.find('NavLink').simulate('click');
      expect(mockClick).toHaveBeenCalled();
    });
  });
});
