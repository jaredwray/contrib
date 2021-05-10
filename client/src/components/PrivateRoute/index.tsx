import { FC, useContext } from 'react';

import { Redirect, Route } from 'react-router-dom';

import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

interface Props {
  component: any;
  path: string;
  role: string;
}

const PrivateRoute: FC<Props> = ({ component, path, role }) => {
  const { account } = useContext(UserAccountContext);

  const isAllowed = (role: string) => {
    if (account?.isAdmin) {
      return true;
    }

    if (role === 'influencer' && (account?.influencerProfile || account?.assistant)) {
      return true;
    }

    if (role === 'charity' && account?.charity) {
      return true;
    }

    return false;
  };

  if (!isAllowed(role)) {
    return <Redirect to="/" />;
  }

  return <Route exact component={component} path={path} />;
};

export default PrivateRoute;
