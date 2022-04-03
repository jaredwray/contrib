import { shallow, ShallowWrapper } from 'enzyme';

import Header from '..';
import * as auth from 'src/helpers/useAuth';

const verifiedUser = {
  email: 'johndoe@me.com',
  email_verified: true,
  name: 'Julian Strait',
  picture: 'link-to-a-picture',
  id: 'google-oauth2|12345678901234',
};

describe('Header', () => {
  let wrapper: ShallowWrapper;
  global.Intercom = jest.fn();

  describe('for logged in user', () => {
    beforeEach(() => {
      const spy = jest.spyOn(auth, 'useAuth');
      spy.mockReturnValue({
        isAuthenticated: true,
        logout: () => mockLogout(),
        user: verifiedUser,
      });

      wrapper = shallow(<Header />);
    });

    it('renders component', () => {
      expect(wrapper).toHaveLength(1);
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

      wrapper = shallow(<Header />);
    });

    it('renders component', () => {
      expect(wrapper).toHaveLength(1);
    });
  });
});
