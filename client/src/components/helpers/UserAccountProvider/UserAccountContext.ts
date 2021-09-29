import { createContext } from 'react';

import { UserProfile } from './UserProfile';

type UserContext = {
  account: UserProfile | null;
};

export const UserAccountContext = createContext<UserContext>({
  account: null,
});
