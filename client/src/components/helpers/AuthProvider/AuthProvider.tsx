import { useEffect, useMemo, useState } from 'react';

import { mergeUrlPath } from 'src/helpers/mergeUrlPath';

import { AuthContext, AuthUserType, AuthContextType } from './AuthContext';

interface PropTypes {
  apiUrl: string;
  children: React.ReactNode;
}

type UserInfoResponce = {
  user: AuthUserType;
  isAuthenticated: boolean;
};

export function AuthProvider({ children, apiUrl }: PropTypes) {
  const [user, setUser] = useState<AuthUserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const userInfoResponce = await fetch(mergeUrlPath(apiUrl, '/user'), {
        credentials: 'include',
      });
      return await userInfoResponce.json();
    };

    getUserData()
      .then((userInfo: UserInfoResponce) => {
        if (userInfo?.user?.id) {
          const { user, isAuthenticated } = userInfo;
          setIsAuthenticated(isAuthenticated);
          setUser(user);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [apiUrl]);

  const authContextValue: AuthContextType = useMemo(
    () => ({
      auth: {
        user,
        isAuthenticated,
        isLoading,
        logout: (redirectURL?: string) => {
          let redirectUri = mergeUrlPath(apiUrl, '/logout');

          if (redirectURL) redirectUri += `?redirectURL=${redirectURL}`;

          window.location.href = redirectUri;
        },
        loginWithRedirect: ({ provider, redirectURL }: { provider: string; redirectURL?: string }) => {
          let redirectUri = mergeUrlPath(apiUrl, `${provider}`);

          if (redirectURL) redirectUri += `?redirectURL=${redirectURL}`;

          window.location.href = redirectUri;
        },
      },
    }),
    [user, isAuthenticated, isLoading, apiUrl],
  );

  if (isLoading) {
    return null;
  }

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}
