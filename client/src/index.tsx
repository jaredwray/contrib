import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AppState, Auth0Provider } from '@auth0/auth0-react';

import Charities from './components/Charities/Charities';
import Index from './components/Index/Index';
import Influencers from './components/Admin/Influencers/Influencers';
import InvitationPage from './components/InvitationPage/InvitationPage';
import PhoneNumberConfirmation from './components/PhoneNumberConfirmation/PhoneNumberConfirmation';
import PhoneNumberVerification from './components/PhoneNumberVerification/PhoneNumberVerification';
import Profile from './components/Profile/Profile';
import WelcomePage from './components/WelcomePage/WelcomePage';
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
          <Route path="/charities" exact component={Charities} />
          <Route path="/phone-verification" exact component={PhoneNumberVerification} />
          <Route path="/phone-confirmation" exact component={PhoneNumberConfirmation} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/welcome" exact component={WelcomePage} />
          <Route path="/admin/influencers" exact component={Influencers} />
          <Route path="/invitation/:slug" exact component={InvitationPage} />
        </UserAccountProvider>
      </ContribApolloProvider>
    </Router>
  </Auth0Provider>,
  document.getElementById('root'),
);
