import { mount, ReactWrapper } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import MenuNavLink from 'src/components/Layout/Header/MenuNavLink';
const props: any = {
  link: '/',
  title: 'test',
};
describe('Should render correctly "MenuNavLink"', () => {
  let wrapper: ReactWrapper;
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
