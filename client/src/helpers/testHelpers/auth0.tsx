import { useAuth0 } from '@auth0/auth0-react';
import { mocked } from 'ts-jest/utils';

jest.mock('@auth0/auth0-react');

const mockedUseAuth0 = mocked(useAuth0, true);
const verifiedUser = {
  email: 'johndoe@me.com',
  email_verified: true,
  name: 'Julian Strait',
  picture: 'link-to-a-picture',
  sub: 'google-oauth2|12345678901234',
};

export function withAuthenticatedUser() {
  mockedUseAuth0.mockReturnValue({
    isAuthenticated: true,
    user: verifiedUser,
    logout: jest.fn(),
    loginWithRedirect: jest.fn().mockReturnValue(new Promise((resolve) => resolve(true))),
    getAccessTokenSilently: jest.fn(),
    getAccessTokenWithPopup: jest.fn(),
    getIdTokenClaims: jest.fn(),
    loginWithPopup: jest.fn(),
    isLoading: false,
    buildAuthorizeUrl: jest.fn(),
    buildLogoutUrl: jest.fn(),
  });
}

export function withNotAuthenticatedUser() {
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
  });
}

export { mockedUseAuth0, verifiedUser };
