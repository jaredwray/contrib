import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import MenuNavLink from 'src/components/Layout/Header/MenuNavLink';
const props: any = {
  link: '/',
  title: 'test',
};
describe('Should render correctly "MenuNavLink"', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <MenuNavLink {...props} />
      </Router>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
