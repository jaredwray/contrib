import { ComponentType, FC, ReactElement, useCallback, useContext } from 'react';

import { Redirect, Route } from 'react-router-dom';

import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

interface Props {
  component: ComponentType;
  path: string;
  role: string;
}

const PrivateRoute: FC<Props> = ({ component, path, role }): ReactElement => {
  const { account } = useContext(UserAccountContext);

  const isAllowed = useCallback(
    (role: string) => {
      return (
        account?.isAdmin ||
        (role === 'influencer' && (account?.influencerProfile || account?.assistant)) ||
        (role === 'charity' && account?.charity)
      );
    },
    [account],
  );

  if (!isAllowed(role)) {
    return <Redirect to="/" />;
  }

  return <Route exact component={component} path={path} />;
};

export default PrivateRoute;
