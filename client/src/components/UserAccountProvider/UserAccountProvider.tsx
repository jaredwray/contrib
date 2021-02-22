import { useAuth0 } from '@auth0/auth0-react';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { UserAccount, UserAccountStatus } from '../../model/UserAccount';
import { MyAccountQuery } from '../../apollo/queries/MyAccountQuery';
import { UserAccountContext } from './UserAccountContext';

interface PropTypes {
  children: any;
}

export function UserAccountProvider({ children }: PropTypes) {
  const history = useHistory();
  const location = useLocation();
  const { user, getAccessTokenSilently } = useAuth0();
  const userId = user?.sub;

  const [getMyAccount, { data: myAccountData, error: myAccountError }] = useLazyQuery(MyAccountQuery);
  const [{ userPermissions, userPermissionsError }, setUserPermissions] = useState<{
    userPermissions: undefined | string[];
    userPermissionsError: Error | null;
  }>({
    userPermissions: userId ? undefined : [],
    userPermissionsError: null,
  });

  const userContextValue = useMemo(() => ({ permissions: userPermissions as string[], account: myAccountData }), [
    userPermissions,
    myAccountData,
  ]);

  // load profile when user is logged in
  useEffect(() => {
    if (userId) {
      getMyAccount();
    }
  }, [userId, getMyAccount]);

  useEffect(() => {
    let active = true;
    if (myAccountData?.influencerProfile && !userPermissions?.includes('influencer')) {
      getAccessTokenSilently({ ignoreCache: true }).then(
        (token) => {
          if (active) {
            const { permissions } = JSON.parse(atob(token.split('.')[1]));
            setUserPermissions({ userPermissions: permissions, userPermissionsError: null });
          }
        },
        (error) => {
          if (active) {
            setUserPermissions({ userPermissions: undefined, userPermissionsError: error });
          }
        },
      );
    }
    return () => {
      active = false;
    };
  }, [myAccountData?.influencerProfile, userPermissions, getAccessTokenSilently]);

  useEffect(() => {
    let active = true;
    if (userId) {
      getAccessTokenSilently().then(
        (token) => {
          if (active) {
            const { permissions } = JSON.parse(atob(token.split('.')[1]));
            setUserPermissions({ userPermissions: permissions, userPermissionsError: null });
          }
        },
        (error) => {
          if (active) {
            setUserPermissions({ userPermissions: undefined, userPermissionsError: error });
          }
        },
      );
    } else {
      setUserPermissions({ userPermissions: [], userPermissionsError: null });
    }
    return () => {
      active = false;
    };
  }, [userId, getAccessTokenSilently]);

  // write error to console if permissions fetch fail
  useEffect(() => {
    if (userPermissionsError) {
      console.error('error fetching permissions', userPermissionsError);
    }
  }, [userPermissionsError]);

  // write error to console if profile fetch failed
  useEffect(() => {
    if (myAccountError) {
      console.error('error fetching account data', myAccountError);
    }
  }, [myAccountError]);

  // redirect to onboarding if needed
  const targetPathname = getOnboardingPath(myAccountData?.myAccount);
  const currentPathname = location.pathname;
  useEffect(() => {
    if (targetPathname !== null && targetPathname !== currentPathname) {
      history.push(targetPathname);
    }
  }, [targetPathname, currentPathname, history]);

  if (
    (userId && !myAccountData) ||
    (userId && !userPermissions) ||
    (targetPathname && targetPathname !== currentPathname)
  ) {
    return null;
  }

  return <UserAccountContext.Provider value={userContextValue}>{children}</UserAccountContext.Provider>;
}

function getOnboardingPath(userAccount: UserAccount) {
  if (userAccount?.status === UserAccountStatus.PHONE_NUMBER_REQUIRED) {
    return '/phone-verification';
  }

  // if (userAccount && userAccount.influencerProfile && !userAccount.influencerProfile.profileDescription) {
  //   return '/account';
  // }

  if (userAccount?.status === UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED) {
    return '/phone-confirmation';
  }

  return null;
}
