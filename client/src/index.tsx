import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AppState, Auth0Provider } from '@auth0/auth0-react';

import Index from './components/Index/Index';
import PhoneNumberVerification from './components/PhoneNumberVerification/PhoneNumberVerification';
import PhoneNumberConfirmation from './components/PhoneNumberConfirmation/PhoneNumberConfirmation';
import { UserAccountProvider } from './components/UserAccountProvider';

import './index.scss';
import { ContribApolloProvider } from './apollo/ContribApolloProvider';

export const history = createBrowserHistory();

const onRedirectCallback = (appState: AppState) => {
  history.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
    redirectUri={process.env.REACT_APP_PLATFORM_URL}
    audience={process.env.REACT_APP_API_AUDIENCE}
    onRedirectCallback={onRedirectCallback}
    cacheLocation={'localstorage'}
  >
    <Router history={history}>
      <ContribApolloProvider>
        <UserAccountProvider>
          <Route path="/" exact component={Index} />
          <Route path="/phone-verification" exact component={PhoneNumberVerification} />
          <Route path="/phone-confirmation" exact component={PhoneNumberConfirmation} />
        </UserAccountProvider>
      </ContribApolloProvider>
    </Router>
  </Auth0Provider>,
  document.getElementById('root'),
);
