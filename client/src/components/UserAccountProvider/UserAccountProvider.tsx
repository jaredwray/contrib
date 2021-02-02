import { useAuth0 } from '@auth0/auth0-react';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { UserAccount, UserAccountStatus } from '../../model/UserAccount';
import { MyAccountQuery } from '../../apollo/queries/MyAccountQuery';

interface PropTypes {
  children: any;
}

export function UserAccountProvider({ children }: PropTypes) {
  const history = useHistory();
  const location = useLocation();
  const { user } = useAuth0();
  const userId = user?.sub;

  const [getMyAccount, { data: myAccountData, error: myAccountError }] = useLazyQuery(MyAccountQuery);

  // load profile when user is logged in
  useEffect(() => {
    if (userId) {
      getMyAccount();
    }
  }, [userId, getMyAccount]);

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

  if ((userId && !myAccountData) || (targetPathname && targetPathname !== currentPathname)) {
    return null;
  }

  return children;
}

function getOnboardingPath(userAccount: UserAccount) {
  if (userAccount?.status === UserAccountStatus.PHONE_NUMBER_REQUIRED) {
    return '/phone-verification';
  }

  if (userAccount?.status === UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED) {
    return '/phone-confirmation';
  }

  return null;
}
