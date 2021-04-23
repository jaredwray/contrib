import React from 'react';

import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { ContribApolloProvider } from 'src/apollo/ContribApolloProvider';
import { IntercomStateManager } from 'src/components/IntercomStateManager';
import { UserAccountProvider } from 'src/components/UserAccountProvider';
import Influencers from 'src/modules/admin/Influencers';
import AuctionPage from 'src/modules/auctions/AuctionPage';
import Auctions from 'src/modules/auctions/AuctionsPage';
import EditAuctionBasicPage from 'src/modules/auctions/editAuction/BasicPage/Edit';
import NewAuctionBasicPage from 'src/modules/auctions/editAuction/BasicPage/New';
import EditAuctionDetailsPage from 'src/modules/auctions/editAuction/DetailsPage';
import AuctionDonePage from 'src/modules/auctions/editAuction/DonePage';
import EditAuctionMediaPage from 'src/modules/auctions/editAuction/MediaPage';
import NewAuctionWizardPage from 'src/modules/auctions/NewAuctionPage';
import HomePage from 'src/modules/Home';
import Assistants from 'src/modules/Influencer/Assistants';
import InvitationPage from 'src/modules/Invitation';
import PhoneNumberConfirmation from 'src/modules/phoneNumber/Confirmation';
import PhoneNumberVerification from 'src/modules/phoneNumber/Verification';
import Privacy from 'src/modules/Privacy';
import Terms from 'src/modules/Terms';

import 'src/index.scss';
import { AfterLogin } from './components/AfterLogin';
import { mergeUrlPath } from './helpers/mergeUrlPath';
import { InfluencerProfileEditPage } from './modules/Influencer/InfluencerProfileEditPage';
import { InfluencerProfilePage } from './modules/Influencer/InfluencerProfilePage';
import { InfluencerOnboardingBasicPage } from './modules/Influencer/Onboarding/InfluencerOnboardingBasicPage';
import { InfluencerOnboardingCharitiesPage } from './modules/Influencer/Onboarding/InfluencerOnboardingCharitiesPage';
import { InfluencerOnboardingDonePage } from './modules/Influencer/Onboarding/InfluencerOnboardingDonePage';

export const history = createBrowserHistory();

const onRedirectCallback = (appState: AppState) => {
  history.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
  <ToastProvider>
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
            <IntercomStateManager>
              <Switch>
                <Route exact component={HomePage} path="/" />
                <Route exact component={AfterLogin} path="/after-login" />
                <Route exact component={PhoneNumberVerification} path="/phone-verification" />
                <Route exact component={PhoneNumberConfirmation} path="/phone-confirmation" />
                <Route exact component={InfluencerOnboardingBasicPage} path="/onboarding/basic" />
                <Route exact component={InfluencerOnboardingCharitiesPage} path="/onboarding/charities" />
                <Route exact component={InfluencerOnboardingDonePage} path="/onboarding/done" />
                <Route exact component={Influencers} path="/admin/influencers" />
                <Route exact component={InvitationPage} path="/invitation/:slug" />
                <Route exact component={Auctions} path="/auctions" />
                <Route exact component={InfluencerProfilePage} path="/profiles/:influencerId" />
                <Route exact component={InfluencerProfileEditPage} path="/profiles/:influencerId/edit" />
                <Route exact component={Assistants} path="/assistants/:influencerId" />
                <Route exact component={NewAuctionWizardPage} path="/auctions/new" />
                <Route exact component={NewAuctionBasicPage} path="/auctions/:ownerId/new/basic" />
                <Route exact component={NewAuctionBasicPage} path="/auctions/new/basic" />
                <Route exact component={EditAuctionBasicPage} path="/auctions/:auctionId/basic" />
                <Route exact component={EditAuctionMediaPage} path="/auctions/:auctionId/media" />
                <Route exact component={EditAuctionDetailsPage} path="/auctions/:auctionId/details" />
                <Route exact component={AuctionPage} path="/auctions/:auctionId" />
                <Route exact component={AuctionDonePage} path="/auctions/:auctionId/done" />
                <Route exact component={Privacy} path="/privacy-policy" />
                <Route exact component={Terms} path="/terms" />
              </Switch>
            </IntercomStateManager>
          </UserAccountProvider>
        </ContribApolloProvider>
      </Router>
    </Auth0Provider>
  </ToastProvider>,
  document.getElementById('root'),
);
