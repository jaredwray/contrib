import { FC } from 'react';

import { useReactiveVar } from '@apollo/client';
import { Redirect } from 'react-router-dom';

import { returnUrlVar } from 'src/apollo/vars/returnUrlVar';

/**
 * A separate page where Auth0 callback leads to.
 *
 * While it only redirects to home page, there is a {@link UserAccountProvider} up the component tree
 * which ensures profile is loaded, and redirects to onboarding if needed.
 *
 * This prevents irritating screen flickering while app is guessing whether onboarding is needed.
 *
 * @see UserAccountProvider
 */

export const AfterLogin: FC = () => {
  const returnUrl = useReactiveVar(returnUrlVar);
  const redirectUrl = (returnUrl && returnUrl.startsWith('/') && returnUrl) || '/';

  return <Redirect to={redirectUrl} />;
};
