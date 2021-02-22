import { shallow } from 'enzyme';
import { withAuthenticatedUser, withNotAuthenticatedUser, mockedUseAuth0 } from '../../testHelpers/auth0';
import Banner from './Banner';

describe('Banner', () => {
  describe('for logged in user', () => {
    it('does not render sign up button', () => {
      withAuthenticatedUser();

      let wrapper = shallow(<Banner />);
      expect(wrapper.find('.banner-sign-up-button')).toHaveLength(0);
    });
  });

  describe('for not logged in user', () => {
    it('renders sign up button', () => {
      withNotAuthenticatedUser();

      let wrapper = shallow(<Banner />);
      let signUpButton = wrapper.find('.banner-sign-up-button');
      expect(signUpButton).toHaveLength(1);

      signUpButton.simulate('click');
      expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
    });
  });
});
