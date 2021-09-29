import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SwipeableLink from '..';

const props = {
  to: '/test',
  children: <>test</>,
};

describe('Should render correctly "UserAccountProvider"', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={[`/`]}>
        <SwipeableLink {...props} />
      </MemoryRouter>,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('e.screenX !== state.current.x', () => {
    wrapper.find(Link).simulate('click');
  });
  it(' state.current.x === e.screenX;', () => {
    wrapper.find(Link).simulate('mouseDown');
    wrapper.find(Link).simulate('click');
  });
  it('should have Link to "/test"', () => {
    expect(wrapper.find(Link).props().to).toBe('/test');
  });
});
