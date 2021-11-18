import { mount, ReactWrapper } from 'enzyme';
import { mocked } from 'ts-jest/utils';
import { useAuth0 } from '@auth0/auth0-react';

import IntercomStateManager from '../index';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { testAccount } from 'src/helpers/testHelpers/account';

describe('IntercomStateManager', () => {
  jest.mock('@auth0/auth0-react');
  const mockedUseAuth0 = mocked(useAuth0, true);

  let wrapper: ReactWrapper;
  const OLD_ENV = process.env;

  global.Intercom = jest.fn();

  beforeEach(() => {
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
