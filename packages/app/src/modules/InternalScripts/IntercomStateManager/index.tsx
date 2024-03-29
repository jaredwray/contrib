import { FC, useContext, useEffect } from 'react';

import { getUnixTime } from 'date-fns';
import { toDate } from 'date-fns-tz';

import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { useAuth } from 'src/helpers/useAuth';

const IntercomStateManager: FC = () => {
  const { user } = useAuth();
  const { account } = useContext(UserAccountContext);

  useEffect(() => {
    const appId = process.env.REACT_APP_INTERCOM_APP_ID;

    if (!appId) return;

    const w = window as any;

    w.Intercom('boot', {
      app_id: appId,
      name: user?.name,
      email: user?.email,
      created_at: account?.createdAt ? getUnixTime(toDate(account.createdAt)) : null,
    });
  }, [account, user]);

  return null;
};

export default IntercomStateManager;
