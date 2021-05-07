import { useEffect, useMemo } from 'react';

import { useLazyQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory, useLocation } from 'react-router-dom';

import { MyAccountQuery } from 'src/apollo/queries/myAccountQuery';
import { invitationTokenVar } from 'src/apollo/vars/invitationTokenVar';
import { returnUrlVar } from 'src/apollo/vars/returnUrlVar';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';
import { UserAccount, UserAccountStatus } from 'src/types/UserAccount';

import { UserAccountContext } from './UserAccountContext';

interface PropTypes {
  children: any;
}

export function UserAccountProvider({ children }: PropTypes) {
  const history = useHistory();
  const location = useLocation();
  const { user, isLoading: userIsLoading } = useAuth0();
  const userId = user?.sub;

  const [getMyAccount, { data: myAccountData, error: myAccountError }] = useLazyQuery(MyAccountQuery);

  const queryParams = useUrlQueryParams();
  const myAccount = myAccountData?.myAccount;

  const userContextValue = useMemo(() => ({ account: myAccount }), [myAccount]);

  // load profile when user is logged in
  useEffect(() => {
    if (userId) {
      getMyAccount();
    }
  }, [userId, getMyAccount]);

  // write error to console if something went wrong
  useEffect(() => {
    if (myAccountError) {
      // eslint-disable-next-line no-console
      console.error('error fetching account data', myAccountError);
    }
  }, [myAccountError]);

  useEffect(() => {
    if (myAccount?.charity && !myAccount.charity.stripeStatus) {
      window.location.href = myAccount.charity.stripeAccountLink;
    }
  }, [myAccount]);

  // redirect to onboarding if needed
  const targetPathname = getOnboardingPath(myAccount);
  const currentPathname = location.pathname;
  useEffect(() => {
    if (targetPathname !== null && targetPathname !== currentPathname) {
      history.replace(targetPathname);
    }
  }, [targetPathname, currentPathname, history]);

  const invitationToken = queryParams.get('invite');
  const returnUrl = queryParams.get('returnUrl');
  useEffect(() => {
    if (invitationToken) {
      invitationTokenVar(invitationToken);
    }
    if (returnUrl) {
      returnUrlVar(returnUrl);
    }
  }, [invitationToken, returnUrl]);

  if (userIsLoading || (userId && !myAccountData) || (targetPathname && targetPathname !== currentPathname)) {
    return null;
  }

  return <UserAccountContext.Provider value={userContextValue}>{children}</UserAccountContext.Provider>;
}

function getOnboardingPath(userAccount: UserAccount) {
  if (userAccount?.status === UserAccountStatus.PHONE_NUMBER_REQUIRED) {
    return '/phone-verification';
  }

  if (userAccount?.influencerProfile && !userAccount.influencerProfile.profileDescription) {
    return '/onboarding/basic';
  }

  if (userAccount?.status === UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED) {
    return '/phone-confirmation';
  }

  return null;
}
