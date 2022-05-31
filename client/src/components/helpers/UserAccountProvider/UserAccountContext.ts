import { createContext } from 'react';

import { UserAccount } from 'src/types/UserAccount';

type UserContext = {
  account: UserAccount | null;
};

export const UserAccountContext = createContext<UserContext>({
  account: null,
});
