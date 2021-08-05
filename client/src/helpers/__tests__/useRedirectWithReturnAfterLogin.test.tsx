import { mount } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';
import { mocked } from 'ts-jest/utils';
import { useAuth0 } from '@auth0/auth0-react';

import { useRedirectWithReturnAfterLogin } from '../useRedirectWithReturnAfterLogin';

jest.mock('@auth0/auth0-react');
const mockedUseAuth0 = mocked(useAuth0, true);

const TestHook = (props: { callback: Function }) => {
  const { callback } = props;
  callback('/test');
  return null;
};

describe('RedirectWithReturnAfterLogin', () => {
  let RedirectWithReturnAfterLogin: any;
  beforeEach(() => {
    testHook(() => {
      RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();
    });
  });

  const testHook = (callback: any) => {
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
    mount(
      <ToastProvider>
        <TestHook callback={callback} />
      </ToastProvider>,
    );
  };
  it('should return function', () => {
    expect(RedirectWithReturnAfterLogin).toBeInstanceOf(Function);
  });
  it('it should call function and redirect', () => {
    RedirectWithReturnAfterLogin('/test');
  });
});

describe('RedirectWithReturnAfterLogin', () => {
  let RedirectWithReturnAfterLogin: any;
  beforeEach(() => {
    testHook(() => {
      RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();
    });
  });

  const testHook = (callback: any) => {
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
    mount(
      <ToastProvider>
        <TestHook callback={callback} />
      </ToastProvider>,
    );
  };
  it('it should call function and not redirect', () => {
    RedirectWithReturnAfterLogin('/test');
  });
});
