import { createContext } from 'react';

export type AuthUserType = {
  id: string;
  picture: string;
  name: string;
  email: string;
};

type AuthType = {
  user: AuthUserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: (redirectURL?: string) => void;
  loginWithRedirect: ({ provider, redirectURL }: { provider: string; redirectURL?: string }) => void;
};

export type AuthContextType = {
  auth: AuthType | null;
};

export const AuthContext = createContext<AuthContextType>({
  auth: null,
});
