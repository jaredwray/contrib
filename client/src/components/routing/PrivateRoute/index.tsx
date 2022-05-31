import { ComponentType, FC, ReactElement, useContext } from 'react';

import { Redirect, Route } from 'react-router-dom';

import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';

interface Props {
  component: ComponentType;
  path: string;
  role?: string;
  roles?: string[];
}

const PrivateRoute: FC<Props> = ({ component, path, role, roles }): ReactElement | null => {
  const requiredRoles = roles || [role];
  const { account } = useContext(UserAccountContext);
  const { isAuthenticated } = useAuth();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const isAllowed =
    account?.isAdmin ||
    (requiredRoles.includes('influencer') && (account?.influencerProfile || account?.assistant)) ||
    (requiredRoles.includes('assistant') && account?.assistant) ||
    (requiredRoles.includes('charity') && account?.charity) ||
    (requiredRoles.includes('user') && account?.mongodbId);

  if (isAllowed) return <Route exact component={component} path={path} />;
  if (isAuthenticated) return <Redirect to="/" />;

  RedirectWithReturnAfterLogin(window.location.pathname);
  return null;
};

export default PrivateRoute;
