import React from 'react';

import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom';
import { Route, Router } from 'react-router-dom';

import { ContribApolloProvider } from 'src/apollo/ContribApolloProvider';
import { UserAccountProvider } from 'src/components/UserAccountProvider';
import Influencers from 'src/modules/admin/Influencers';
import Charities from 'src/modules/Charities';
import HomePage from 'src/modules/Home';
import InvitationPage from 'src/modules/Invitation';
import PhoneNumberConfirmation from 'src/modules/phoneNumber/Confirmation';
import PhoneNumberVerification from 'src/modules/phoneNumber/Verification';
import Profile from 'src/modules/Profile';
import WelcomePage from 'src/modules/Welcome';

import 'src/index.scss';
import { AfterLogin } from './components/AfterLogin';
import { mergeUrlPath } from './helpers/mergeUrlPath';

export const history = createBrowserHistory();

const onRedirectCallback = (appState: AppState) => {
  history.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
  <Auth0Provider
    audience={process.env.REACT_APP_API_AUDIENCE}
    cacheLocation={'localstorage'}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
    domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
    redirectUri={mergeUrlPath(process.env.REACT_APP_PLATFORM_URL, '/after-login')}
    onRedirectCallback={onRedirectCallback}
  >
    <Router history={history}>
      <ContribApolloProvider>
        <UserAccountProvider>
          <Route exact component={HomePage} path="/" />
          <Route exact component={AfterLogin} path="/after-login" />
          <Route exact component={Charities} path="/charities" />
          <Route exact component={PhoneNumberVerification} path="/phone-verification" />
          <Route exact component={PhoneNumberConfirmation} path="/phone-confirmation" />
          <Route exact component={Profile} path="/profile" />
          <Route exact component={WelcomePage} path="/welcome" />
          <Route exact component={Influencers} path="/admin/influencers" />
          <Route exact component={InvitationPage} path="/invitation/:slug" />
        </UserAccountProvider>
      </ContribApolloProvider>
    </Router>
  </Auth0Provider>,
  document.getElementById('root'),
);
