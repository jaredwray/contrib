import { ComponentType, FC, ReactElement, useCallback, useContext } from 'react';

import { Redirect, Route } from 'react-router-dom';

import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { useAuth } from 'src/helpers/useAuth';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';

interface Props {
  component: ComponentType;
  path: string;
  role: string;
}

const PrivateRoute: FC<Props> = ({ component, path, role }): ReactElement | null => {
  const { account } = useContext(UserAccountContext);
  const { isAuthenticated } = useAuth();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const isAllowed = useCallback(
    (role: string) => {
      return (
        account?.isAdmin ||
        (role === 'influencer' && (account?.influencerProfile || account?.assistant)) ||
        (role === 'charity' && account?.charity) ||
        (role === 'user' && account?.mongodbId)
      );
    },
    [account],
  );

  if (isAllowed(role)) return <Route exact component={component} path={path} />;
  if (isAuthenticated) return <Redirect to="/" />;

  RedirectWithReturnAfterLogin(window.location.pathname);
  return null;
};

export default PrivateRoute;
