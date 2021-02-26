import { useAuth0 } from '@auth0/auth0-react';
import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { UserAccount, UserAccountStatus } from '../../model/UserAccount';
import { MyAccountQuery } from '../../apollo/queries/MyAccountQuery';
import { UserAccountContext } from './UserAccountContext';
import { useUrlQueryParams } from '../../helpers/useUrlQueryParams';
import { invitationTokenVar } from '../../apollo/vars/invitationTokenVar';

interface PropTypes {
  children: any;
}

export function UserAccountProvider({ children }: PropTypes) {
  const history = useHistory();
  const location = useLocation();
  const { user, isLoading: userIsLoading, getAccessTokenSilently } = useAuth0();
  const userId = user?.sub;

  const [getMyAccount, { data: myAccountData, error: myAccountError }] = useLazyQuery(MyAccountQuery);
  const [{ userPermissions, userPermissionsError }, setUserPermissions] = useState<{
    userPermissions: undefined | string[];
    userPermissionsError: Error | null;
  }>({
    userPermissions: userId ? undefined : [],
    userPermissionsError: null,
  });

  const queryParams = useUrlQueryParams();

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

  const refreshUserPermissions = useCallback(
    (forceRefreshSession = false) => {
      if (!userId) {
        setUserPermissions({ userPermissions: [], userPermissionsError: null });
        return;
      }

      let active = true;
      getAccessTokenSilently({ ignoreCache: forceRefreshSession }).then(
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
      return () => {
        active = false;
      };
    },
    [getAccessTokenSilently, userId],
  );

  // if account data is showing user has an influencer profile, but token does not feature an "influencer" permission,
  // this means the token is outdated, and session must be refreshed (this happens when influencer has just signed up)
  useEffect(() => {
    if (myAccountData?.influencerProfile && !userPermissions?.includes('influencer')) {
      return refreshUserPermissions(true);
    }
  }, [myAccountData?.influencerProfile, userPermissions, refreshUserPermissions]);

  // parses user token for permissions - we use these to understand what he has access for
  useEffect(() => refreshUserPermissions(), [refreshUserPermissions]);

  // write error to console if something went wrong
  useEffect(() => {
    if (userPermissionsError) {
      console.error('error fetching permissions', userPermissionsError);
    }
    if (myAccountError) {
      console.error('error fetching account data', myAccountError);
    }
  }, [userPermissionsError, myAccountError]);

  // redirect to onboarding if needed
  const targetPathname = getOnboardingPath(myAccountData?.myAccount);
  const currentPathname = location.pathname;
  useEffect(() => {
    if (targetPathname !== null && targetPathname !== currentPathname) {
      if (targetPathname === '/profile') {
        history.replace(`${targetPathname}?sbs=true`);
      } else {
        history.replace(targetPathname);
      }
    }
  }, [targetPathname, currentPathname, history]);

  const invitationToken = queryParams.get('invite');
  useEffect(() => {
    if (invitationToken) {
      invitationTokenVar(invitationToken);
    }
  }, [invitationToken]);

  if (
    userIsLoading ||
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

  if (userAccount && userAccount.influencerProfile && !userAccount.influencerProfile.profileDescription) {
    return '/profile';
  }

  if (userAccount?.status === UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED) {
    return '/phone-confirmation';
  }

  return null;
}
