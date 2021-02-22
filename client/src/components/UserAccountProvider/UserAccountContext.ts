import { createContext } from 'react';

type UserContext = {
  account: any;
  permissions: string[];
};

export const UserAccountContext = createContext<UserContext>({
  account: null,
  permissions: [],
});
