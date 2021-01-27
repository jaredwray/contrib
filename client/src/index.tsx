import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Auth0Provider, AppState } from '@auth0/auth0-react';

import Index from './components/Index/Index'

import './index.scss'

export const history = createBrowserHistory()

const onRedirectCallback = (appState: AppState) => {
  history.replace(appState?.returnTo || window.location.pathname)
}

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <Router history={history}>
      <Route path="/" exact component={Index} />
    </Router>
  </Auth0Provider>,
  document.getElementById('root')
)
