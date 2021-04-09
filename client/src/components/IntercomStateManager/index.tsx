import { useEffect } from 'react';

import { useAuth0 } from '@auth0/auth0-react';

interface PropTypes {
  children: any;
}

export function IntercomStateManager({ children }: PropTypes) {
  const { user } = useAuth0();

  useEffect(() => {
    if (process.env.REACT_APP_INTERCOM_APP_ID) {
      const w = window as any;
      w.Intercom('shutdown');
      w.Intercom('boot', {
        app_id: process.env.REACT_APP_INTERCOM_APP_ID,
        name: user?.name,
        email: user?.email,
      });
    }
  }, [user]);

  return children;
}
