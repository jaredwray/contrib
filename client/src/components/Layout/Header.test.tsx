import { shallow } from 'enzyme';
import { withAuthenticatedUser, withNotAuthenticatedUser, mockedUseAuth0, verifiedUser } from '../../testHelpers/auth0';
import Header from './Header';

describe('Header', () => {
  describe('menu', () => {
    let wrapper, menuButton;

    describe('for logged in user', () => {
      beforeEach(() => {
        withAuthenticatedUser();

        wrapper = shallow(<Header />);
        menuButton = wrapper.find('#headerNavDropdown');

        menuButton.simulate('click');
      });

      it("displays user's name", () => {
        expect(wrapper.find('.dropdown-menu-user-name').text()).toEqual(verifiedUser.name);
      });

      it("displays user's picture", () => {
        expect(wrapper.find('.dropdown-menu-user-picture').prop('src')).toEqual(verifiedUser.picture);
      });

      it('displays logout button', () => {
        let logoutButton = wrapper.find("[data-test-id='dropdown-menu-logout-button']");

        expect(logoutButton).toHaveLength(1);
        expect(logoutButton.text()).toEqual('Sign Out');

        logoutButton.simulate('click');
        expect(mockedUseAuth0().logout).toHaveBeenCalledTimes(1);
      });
    });

    describe('for not logged in user', () => {
      beforeEach(() => {
        withNotAuthenticatedUser();

        wrapper = shallow(<Header />);
        menuButton = wrapper.find('#headerNavDropdown');

        menuButton.simulate('click');
      });

      it("does not display user's name", () => {
        expect(wrapper.find('.dropdown-menu-user-name')).toHaveLength(0);
      });

      it("does not display user's picture", () => {
        expect(wrapper.find('.dropdown-menu-user-picture')).toHaveLength(0);
      });

      it('displays login button', () => {
        let loginButton = wrapper.find("[data-test-id='dropdown-menu-login-button']");

        expect(loginButton).toHaveLength(1);
        expect(loginButton.text()).toEqual('Log In');

        loginButton.simulate('click');
        expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
      });
    });
  });
});
