import { mount, ReactWrapper } from 'enzyme';
import { mocked } from 'ts-jest/utils';

import IntercomStateManager from '../index';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { testAccount } from 'src/helpers/testHelpers/account';
import * as auth from 'src/helpers/useAuth';

describe('IntercomStateManager', () => {
  let wrapper: ReactWrapper;
  const OLD_ENV = process.env;

  global.Intercom = jest.fn();

  const verifiedUser = {
    email: 'johndoe@me.com',
    email_verified: true,
    name: 'Julian Strait',
    picture: 'link-to-a-picture',
    id: 'google-oauth2|12345678901234',
  };

  beforeEach(() => {
    const spy = jest.spyOn(auth, 'useAuth');
    spy.mockReturnValue({
      user: verifiedUser,
    });
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = OLD_ENV;
  });

  describe('with defined REACT_APP_INTERCOM_APP_ID', () => {
    it('renders without errors', () => {
      process.env.REACT_APP_INTERCOM_APP_ID = 'id';
      const wrapper = mount(<IntercomStateManager />);
      expect(wrapper).toHaveLength(1);
    });
  });

  describe('with not defined REACT_APP_INTERCOM_APP_ID', () => {
    it('renders without errors', () => {
      process.env.REACT_APP_INTERCOM_APP_ID = null;
      const wrapper = mount(<IntercomStateManager />);
      expect(wrapper).toHaveLength(1);
    });
  });

  describe('when user is logged in', () => {
    it('renders without errors', () => {
      process.env.REACT_APP_INTERCOM_APP_ID = 'id';
      const wrapper = mount(
        <UserAccountContext.Provider value={testAccount}>
          <IntercomStateManager />
        </UserAccountContext.Provider>,
      );
      expect(wrapper).toHaveLength(1);
    });
  });
});
