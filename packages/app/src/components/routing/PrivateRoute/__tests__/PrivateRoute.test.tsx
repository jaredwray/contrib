import { ReactWrapper, mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { Router, MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';

import PrivateRoute from 'src/components/routing/PrivateRoute';
import * as auth from 'src/helpers/useAuth';
import { testAccount } from 'src/helpers/testHelpers/account';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

const spyUseAuth = jest.spyOn(auth, 'useAuth');

describe('PrivateRoute', () => {
  const props: any = {
    path: '/test',
    role: 'influencer',
    conmponent: <></>,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the route is allowed to the user', () => {
    beforeEach(() => {
      spyUseAuth.mockReturnValue({
        isAuthenticated: true,
      });
    });

    it('returns Route', () => {
      const wrapper = mount(
        <UserAccountContext.Provider value={testAccount}>
          <MockedProvider>
            <MemoryRouter initialEntries={['/admin/auctions']}>
              <PrivateRoute {...props} />
            </MemoryRouter>
          </MockedProvider>
        </UserAccountContext.Provider>,
      );
      expect(wrapper).toHaveLength(1);
      expect(wrapper.find('Route')).toHaveLength(1);
    });
  });

  describe('when the user is not logged in', () => {
    beforeEach(() => {
      spyUseAuth.mockReturnValue({
        isAuthenticated: false,
      });
    });
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      pathname: '/private/path',
    };

    it('redirects to the log in page', () => {
      const history = createMemoryHistory();

      const wrapper = mount(
        <Router history={history}>
          <PrivateRoute {...{ ...props, role: 'notAllowed' }} />
        </Router>,
      );
      expect(wrapper).toHaveLength(1);
      expect(history.location.pathname).toBe(`/log-in`);
      expect(history.location.search).toBe(`?returnURL=/private/path`);
    });
  });

  describe('when the route is not allowed to the user', () => {
    beforeEach(() => {
      spyUseAuth.mockReturnValue({
        isAuthenticated: true,
      });
    });

    it('redirects to the home page', () => {
      const history = createMemoryHistory();
      const wrapper = mount(
        <MemoryRouter>
          <PrivateRoute {...{ ...props, role: 'user' }} />
        </MemoryRouter>,
      );
      expect(wrapper).toHaveLength(1);
      expect(history.location.pathname).toBe('/');
      expect(history.location.search).toBe('');
    });
  });
});
