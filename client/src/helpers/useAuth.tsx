import { useContext } from 'react';

import { AuthContext } from 'src/components/helpers/AuthProvider/AuthContext';

export const useAuth = () => {
  const { auth } = useContext(AuthContext);
  return { ...auth };
};
