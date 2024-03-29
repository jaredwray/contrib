import { useEffect, useMemo } from 'react';

import { useLazyQuery } from '@apollo/client';
import { useHistory, useLocation } from 'react-router-dom';

import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { invitationTokenVar } from 'src/apollo/vars/invitationTokenVar';
import { returnUrlVar } from 'src/apollo/vars/returnUrlVar';
import { useAuth } from 'src/helpers/useAuth';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';
import { UserAccount, UserAccountStatus } from 'src/types/UserAccount';

import { UserAccountContext } from './UserAccountContext';

interface PropTypes {
  children: React.ReactNode;
}

export function UserAccountProvider({ children }: PropTypes) {
  const history = useHistory();
  const location = useLocation();
  const { user } = useAuth();
  const userId = user?.id;
  const [getMyAccount, { data: myAccountData }] = useLazyQuery(MyAccountQuery);
  const queryParams = useUrlQueryParams();
  const myAccount = myAccountData?.myAccount;
  const userContextValue = useMemo(() => ({ account: myAccount }), [myAccount]);

  // load profile when user is logged in
  useEffect(() => {
    if (userId) getMyAccount();
  }, [userId, getMyAccount]);

  if (myAccount?.charity && !myAccount.charity.stripeStatus) {
    window.location.href = myAccount.charity.stripeAccountLink;
  }

  // redirect to onboarding if needed
  const targetPathname = getOnboardingPath(myAccount);
  const currentPathname = location.pathname;

  useEffect(() => {
    if (targetPathname !== null && targetPathname !== currentPathname) history.replace(targetPathname);
  }, [targetPathname, currentPathname, history]);

  const invitationToken = queryParams.get('invite');
  const returnUrl = queryParams.get('returnURL');

  useEffect(() => {
    if (invitationToken) invitationTokenVar(invitationToken);
    if (returnUrl) returnUrlVar(returnUrl);
  }, [invitationToken, returnUrl]);

  if ((userId && !myAccountData) || (targetPathname && targetPathname !== currentPathname)) return null;

  return <UserAccountContext.Provider value={userContextValue}>{children}</UserAccountContext.Provider>;
}

function getOnboardingPath(userAccount: UserAccount) {
  if (userAccount?.influencerProfile && !userAccount.influencerProfile.profileDescription) return '/onboarding/basic';
  if (userAccount?.status === UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED) return '/phone-confirmation';
  if (userAccount?.status === UserAccountStatus.PHONE_NUMBER_REQUIRED) {
    const returnUrl = returnUrlVar();
    returnUrlVar(returnUrl?.split('?')[0]);

    return '/phone-verification';
  }

  return null;
}
