import { shallow } from 'enzyme';

import { withAuthenticatedUser, withNotAuthenticatedUser, mockedUseAuth0 } from 'src/helpers/testHelpers/auth0';

import Banner from '../Banner';

describe('Banner', () => {
  describe('for logged in user', () => {
    it('does not render sign up button', () => {
      withAuthenticatedUser();

      const wrapper = shallow(<Banner />);
      expect(wrapper.find('.btn-with-arrows')).toHaveLength(0);
    });
  });

  describe('for not logged in user', () => {
    it('renders sign up button', () => {
      withNotAuthenticatedUser();

      const wrapper = shallow(<Banner />);
      const signUpButton = wrapper.find('.btn-with-arrows');
      expect(signUpButton).toHaveLength(1);

      signUpButton.simulate('click');
      expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
    });
  });
});
