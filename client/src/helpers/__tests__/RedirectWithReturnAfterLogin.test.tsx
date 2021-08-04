import { mount } from 'enzyme';
import { mocked } from 'ts-jest/utils';
import { useAuth0 } from '@auth0/auth0-react';
import { ToastProvider } from 'react-toast-notifications';

import { RedirectWithReturnAfterLogin } from '../RedirectWithReturnAfterLogin';

jest.mock('@auth0/auth0-react');

const mockedUseAuth0 = mocked(useAuth0, true);
const verifiedUser = {
  email: 'johndoe@me.com',
  email_verified: true,
  name: 'Julian Strait',
  picture: 'link-to-a-picture',
  sub: 'google-oauth2|12345678901234',
};
describe('RedirectWithReturnAfterLogin', () => {
  const Component = () => {
    try {
      RedirectWithReturnAfterLogin('/test');
    } catch (error) {
      const errorFn = jest.fn();
      if (error) {
        errorFn();
      }
    }
    return <>test</>;
  };

  it('should redirect  ', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
      user: undefined,
      logout: jest.fn(),
      loginWithRedirect: jest.fn().mockReturnValue(new Promise((resolve) => resolve(true))),
      getAccessTokenSilently: jest.fn(),
      getAccessTokenWithPopup: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
      isLoading: false,
      buildAuthorizeUrl: jest.fn(),
      buildLogoutUrl: jest.fn(),
      handleRedirectCallback: jest.fn(),
    });
    const wrapper = mount(
      <ToastProvider>
        <Component />
      </ToastProvider>,
    );

    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
  });

  it('should redirect', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
      user: undefined,
      logout: jest.fn(),
      loginWithRedirect: jest.fn().mockRejectedValueOnce(new Error('error')),
      getAccessTokenSilently: jest.fn(),
      getAccessTokenWithPopup: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
      isLoading: false,
      buildAuthorizeUrl: jest.fn(),
      buildLogoutUrl: jest.fn(),
      handleRedirectCallback: jest.fn(),
    });
    const wrapper = mount(
      <ToastProvider>
        <Component />
      </ToastProvider>,
    );

    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
  });
});
