import { shallow, ShallowWrapper } from 'enzyme';

import Menu from '../Menu';
import * as auth from 'src/helpers/useAuth';

const verifiedUser = {
  email: 'johndoe@me.com',
  email_verified: true,
  name: 'Julian Strait',
  picture: 'link-to-a-picture',
  id: 'google-oauth2|12345678901234',
};

const mockLogout = jest.fn();

describe('Menu', () => {
  let wrapper: ShallowWrapper;
  let menuButton;
  global.Intercom = jest.fn();

  describe('for logged in user', () => {
    beforeEach(() => {
      const spy = jest.spyOn(auth, 'useAuth');
      spy.mockReturnValue({
        isAuthenticated: true,
        logout: () => mockLogout(),
        user: verifiedUser,
      });

      wrapper = shallow(<Menu />);
      menuButton = wrapper.find("[data-test-id='header-nav-dropdown']");

      menuButton.simulate('click');
    });

    it("displays user's name", () => {
      expect(wrapper.find("[data-test-id='user-name']").text()).toEqual(verifiedUser.name);
    });

    it('displays logout button', () => {
      const logoutButton = wrapper.find("[data-test-id='logout-button']");

      expect(logoutButton).toHaveLength(1);
      expect(logoutButton.text()).toEqual('Sign Out');

      logoutButton.simulate('click');
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('for not logged in user', () => {
    beforeEach(() => {
      const spy = jest.spyOn(auth, 'useAuth');
      spy.mockReturnValue({
        isAuthenticated: false,
        logout: () => mockLogout(),
        user: null,
      });

      wrapper = shallow(<Menu />);
      menuButton = wrapper.find("[data-test-id='header-nav-dropdown']");

      menuButton.simulate('click');
    });

    it("does not display user's name", () => {
      expect(wrapper.find("[data-test-id='user-name']")).toHaveLength(0);
    });

    it('displays login button', () => {
      const loginButton = wrapper.find("[data-test-id='login-button']");

      expect(loginButton).toHaveLength(1);
      expect(loginButton.props().title).toEqual('Log In');

      loginButton.simulate('click');
    });
  });
});
